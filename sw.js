/* Levante — service worker
   - app: rede primeiro (atualiza sempre que há net), cache como rede de segurança
   - MAPA: tiles guardados em cache (cache-first) para a viagem não ficar às escuras
     quando falha a rede — inclui pré-descarga do corredor da rota
   - REGRA (dd-55): sempre que uma publicação muda o index, o V muda TAMBÉM —
     um sw byte-igual não dispara ciclo de atualização nenhum, e as janelas
     abertas ficam sem qualquer sinal de que há versão nova. O portão em
     tools/publicar.sh recusa publicar index novo com sw byte-igual. */
/* ═══ levante-v25 — 10/08/2026 ═══════════════════════════════════════════
   NOTA DE RELEASE (dd-55: o V sobe SEMPRE que o index muda)

   · O MICROFONE VOLTA A ESTAR DENTRO DO CAMPO de pesquisa. Tinha saído para
     cima do botão do GPS, meio fora do cartão, e a culpa foi da obra da
     versão anterior: para a lista de resultados ocupar a barra inteira, o
     campo perdeu a âncora que segurava o 🎤. Agora a lista é irmã do campo em
     vez de filha, e cada um tem a sua âncora — as duas coisas cabem.
   · O TEXTO DO CAMPO DEIXA DE CORTAR A MEIO DE UMA PALAVRA. Dizia «Pesquisar
     cid…». A app passa a medir o próprio texto contra o próprio campo e a
     ficar com a frase mais informativa que lá cabe, em cada língua e em cada
     largura — em vez de um limiar adivinhado.
   · Quando o ajuste do texto falhar, a app queixa-se uma vez na consola em
     vez de ficar calada.
   ═══════════════════════════════════════════════════════════════════════════ */
/* ═══ levante-v24 — 10/08/2026 (publicada) ═══════════════════════════════════════════
   NOTA DE RELEASE (dd-55: o V sobe SEMPRE que o index muda)

   · dd-204 §2 — as moradas dos resultados deixam de ser cortadas: a lista de
     pesquisa passou de 167 px para 294 num ecrã de 320, e a morada tem duas
     linhas. E a app **deixou de deslizar de lado** em português e francês.
   · dd-204 §2 — a pastilha do calor na faixa dos 7 dias diz «🥵 37°»; a frase
     inteira continua a ser lida por quem usa leitor de ecrã.
   · dd-207 §1 — orçamento de tempo declarado (900 ms): passado ele, a caixa
     diz que ainda está a procurar, sem apagar o que já mostrou.
   · dd-210 §1 — os LUGARES: escrever «Portugal» devolve o país, não uma rua
     com o mesmo nome.
   · 36 frases que apareciam em português a quem tem a app em neerlandês —
     incluindo o veredicto do ecrã principal — passaram a estar traduzidas.
   ═══════════════════════════════════════════════════════════════════════════ */
const V = "levante-v25";
const TILES = "levante-tiles-v1";
/* a cache de tiles do nome antigo continua a ser lida — quem já tinha o mapa
   descarregado não fica sem ele por causa de uma mudança de nome */
const TILES_ANTIGO = "vdm-tiles-v1";
const TILE_MAX = 2600;          // ~40 MB; acima disto apagam-se os mais antigos
/* dd-78/dd-74 (b): saíram os dois ficheiros do Leaflet no cdnjs. O Leaflet
   morreu na A2.2 e o mapa é MapLibre há muito — mas o mal não era só guardar
   uma biblioteca a mais: o `cache.addAll` **falha inteiro** se UM dos pedidos
   não responder, e estes dois eram os únicos que saíam de casa. Um cdnjs lento
   ou bloqueado e o service worker **não instalava** — a app ficava sem cache,
   sem mapa offline e sem sinal de versão nova, por causa de uma biblioteca que
   já não usamos. */
const SHELL = [
  "./", "./index.html", "./manifest.webmanifest", "./icon.svg", "./privacidade.html", "./termos.html",
  /* dd-82: a página de créditos entra no shell, autorizada no mesmo pacote.
     Era o item aberto do rel-58 §5: sem isto, o ⓘ do mapa levava a uma página
     que só existia depois de aberta uma vez com rede — e a atribuição é
     condição de licença, não um extra. O sítio dela é ao lado das outras duas
     legais, que já cá estavam. */
  "./creditos.html",
  "./paises.json",
];
/* dd-78/dd-74 (c): só o OpenFreeMap serve tiles nesta app. O CARTO saiu no
   dd-16 §2 e o tile.openstreetmap.org e o stadiamaps nunca chegaram a entrar —
   ficaram aqui da era raster. Um host a mais nesta lista não é inofensivo:
   manda qualquer resposta desses domínios pelo caminho dos tiles, com a cache
   de 2600 entradas e o tile-de-falta em vez do caminho normal. */
const TILE_HOSTS = /(^|\.)(tiles?\.openfreemap\.org)$/;
const isTile = (u) => TILE_HOSTS.test(u.host);
/* ═══ dd-78/dd-74 (a) — O TILE QUE FALTA, NO FORMATO QUE O MOTOR LÊ ════════
   ISTO ERA O MAPA BRANCO. Aqui devolvia-se um **SVG 256×256** — a grelha
   cinzenta da era raster — a um pedido de tile **VETORIAL**. O MapLibre pede
   um protobuf, recebe SVG, não consegue interpretar e **não desenha nada**.
   Sem rede, ou fora do corredor que estava descarregado, cada tile em falta
   apagava o mapa: foi o que o Ricardo viu a meio de uma viagem (dd-78), e foi
   o que ficou previsto por escrito no relatório 57 §2.

   O que se devolve agora é o tile vetorial sintético de **42 bytes** — um
   polígono que cobre o tile todo, numa camada `levante_falta` que só nós
   conhecemos e que os dois estilos publicados pintam com um tom e uma
   hachura. É o mecanismo que existe desde a A2.2 e que nunca chegou a
   funcionar no ar por causa desta linha.
   A diferença que isto faz para quem vai a conduzir: um tile que não temos
   deixa de ser o vazio, e passa a dizer **"isto não está descarregado"** — que
   é outra informação, e a certa. */
const FALTA_MVT = "Gih4AgoNbGV2YW50ZV9mYWx0YRISGAMiDgkfHxrAQAAAwEC/QAAPKIAg";
const FALTA_TIPO = "application/vnd.mapbox-vector-tile";
function faltaResposta() {
  const bin = atob(FALTA_MVT);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return new Response(buf, { headers: { "Content-Type": FALTA_TIPO } });
}

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
    return faltaResposta();
  }
}

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  if (isTile(u)) { e.respondWith(tileResponse(e.request)); return; }

  const sameOrigin = u.origin === self.location.origin;
  /* dd-78/dd-74 (b), a segunda metade: o cdnjs saiu do SHELL e sai também
     daqui. Era o par da mesma coisa — este ramo existia para servir e guardar
     o Leaflet, e sem ele qualquer resposta do cdnjs passava a ser guardada na
     cache do shell sem ninguém a pedir. Nada nosso vem de um CDN: o motor do
     mapa, o estilo, os glifos, o sprite e a letra vêm todos de casa. */
  if (!sameOrigin) return;                   // APIs meteo/rotas/radar: sempre rede (dados frescos)
  if (sameOrigin && /\/versao\.json$/.test(u.pathname)) return;  // frescura: sempre rede, NUNCA desta cache — em cache, diria para sempre "estás atualizado"
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
