/* Vou de Moto? — service worker v4: app atualiza sempre que há rede; offline usa a cache */
const V = "vdm-v4";
const SHELL = [
  "./", "./index.html", "./manifest.webmanifest", "./icon.svg",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js",
];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(V).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  const sameOrigin = u.origin === self.location.origin;
  const isCDN = u.host === "cdnjs.cloudflare.com";
  if (!sameOrigin && !isCDN) return; // APIs meteo/rotas/radar: sempre rede (dados frescos)
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
