/* Levante — service worker v7
   - app: rede primeiro (atualiza sempre que há net), cache como rede de segurança
   - MAPA: tiles guardados em cache (cache-first) para a viagem não ficar às escuras
     quando falha a rede — inclui pré-descarga do corredor da rota */
const V = "levante-v7";
const TILES = "levante-tiles-v1";
/* a cache de tiles do nome antigo continua a ser lida — quem já tinha o mapa
   descarregado não fica sem ele por causa de uma mudança de nome */
const TILES_ANTIGO = "vdm-tiles-v1";
const TILE_MAX = 2600;          // ~40 MB; acima disto apagam-se os mais antigos
const SHELL = [
  "./", "./index.html", "./manifest.webmanifest", "./icon.svg", "./privacidade.html", "./termos.html",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js",
];
const TILE_HOSTS = /(^|\.)(basemaps\.cartocdn\.com|tiles?\.openfreemap\.org|tile\.openstreetmap\.org|tiles\.stadiamaps\.com)$/;
const isTile = (u) => TILE_HOSTS.test(u.host);
/* tile cinzento-claro 256×256 quando não há rede nem cache (melhor que o vazio preto) */
const BLANK_TILE = "data:image/svg+xml;base64," + btoa(
  '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">' +
  '<rect width="256" height="256" fill="#e8ecf3"/>' +
  '<path d="M0 64H256M0 128H256M0 192H256M64 0V256M128 0V256M192 0V256" stroke="#dbe1ec" stroke-width="1"/></svg>');

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(V).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks
        .filter((k) => k !== V && k !== TILES && k !== TILES_ANTIGO)
        .map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* apaga os tiles mais antigos quando a cache cresce demais */
async function trimTiles() {
  const c = await caches.open(TILES);
  const keys = await c.keys();
  if (keys.length <= TILE_MAX) return;
  const drop = keys.length - Math.floor(TILE_MAX * 0.8);
  for (let i = 0; i < drop; i++) await c.delete(keys[i]);
}

async function tileResponse(req) {
  const c = await caches.open(TILES);
  let hit = await c.match(req, { ignoreVary: true });
  if (!hit) {                                // cai para a cache do nome antigo
    const velha = await caches.open(TILES_ANTIGO);
    hit = await velha.match(req, { ignoreVary: true });
  }
  if (hit) return hit;                       // offline-first: o que já viste, vês sempre
  try {
    const res = await fetch(req);
    if (res && (res.ok || res.type === "opaque")) {
      c.put(req, res.clone()).then(trimTiles).catch(() => {});
    }
    return res;
  } catch (err) {
    return new Response(await (await fetch(BLANK_TILE)).blob(), {
      headers: { "Content-Type": "image/svg+xml" },
    });
  }
}

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  if (isTile(u)) { e.respondWith(tileResponse(e.request)); return; }

  const sameOrigin = u.origin === self.location.origin;
  const isCDN = u.host === "cdnjs.cloudflare.com";
  if (!sameOrigin && !isCDN) return;         // APIs meteo/rotas/radar: sempre rede (dados frescos)
  const putCache = (res) => {
    const copy = res.clone();
    caches.open(V).then((c) => c.put(e.request, copy)).catch(() => {});
    return res;
  };
  if (e.request.mode === "navigate" || (sameOrigin && /index\.html$/.test(u.pathname))) {
    e.respondWith(
      fetch(e.request).then(putCache)
        .catch(() => caches.match(e.request, { ignoreSearch: true })
          .then((h) => h || caches.match("./index.html")))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request, { ignoreSearch: sameOrigin })
      .then((hit) => hit || fetch(e.request).then(putCache))
  );
});

/* pré-descarga do corredor da rota (pedida pela app quando calculas um trajeto) */
async function precache(urls, client) {
  const c = await caches.open(TILES);
  let done = 0, saved = 0;
  const queue = urls.slice(0, 2200);
  const worker = async () => {
    while (queue.length) {
      const url = queue.shift();
      try {
        const req = new Request(url, { mode: "cors" });
        const hit = await c.match(req, { ignoreVary: true });
        if (!hit) {
          const res = await fetch(req);
          if (res && (res.ok || res.type === "opaque")) { await c.put(req, res.clone()); saved++; }
        }
      } catch (err) { /* segue: sem rede, guarda o que der */ }
      done++;
      if (client && done % 25 === 0)
        client.postMessage({ type: "PRECACHE_PROGRESS", done, total: urls.length });
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);  // 4 em paralelo
  await trimTiles();
  if (client) client.postMessage({ type: "PRECACHE_DONE", done, saved, total: urls.length });
}

self.addEventListener("message", (e) => {
  const d = e.data || {};
  if (d.type === "PRECACHE_TILES" && Array.isArray(d.urls)) {
    e.waitUntil(precache(d.urls, e.source));
  } else if (d.type === "TILES_INFO") {
    e.waitUntil(caches.open(TILES).then((c) => c.keys()).then((k) => {
      e.source && e.source.postMessage({ type: "TILES_INFO", count: k.length });
    }));
  } else if (d.type === "TILES_CLEAR") {
    e.waitUntil(caches.delete(TILES).then(() => {
      e.source && e.source.postMessage({ type: "TILES_INFO", count: 0 });
    }));
  }
});
