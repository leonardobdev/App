var CACHE_ALL = false;
var APP_NAME = "App";
var CACHE_VERSION = "0.1";
var CACHE_NAME = `${APP_NAME}_v${CACHE_VERSION}`;
var WHITELIST = [
  "/",
  "/index.html",
  "/manifest.json",
  "/src/js/main.js",
  "/src/css/main.css",
  "/src/img/logo.svg",
  "/src/img/logo.jpg",
  "/src/img/favicon.ico",
  "/src/img/animated_favicon.gif",
  "/src/img/x48.png",
  "/src/img/x72.png",
  "/src/img/x96.png",
  "/src/img/x128.png",
  "/src/img/x192.png",
  "/src/img/x384.png",
  "/src/img/x512.png",
  "/src/img/x1024.png",
];
var BLACKLIST = [];
[WHITELIST, BLACKLIST] = [WHITELIST, BLACKLIST].map(l => l.map(v => "/" + APP_NAME + v));

self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then((response) => {
    if (response) {
      // Verifica se o cache é identico
      const etag = response.headers.get('ETag');
      const requestEtag = event.request.headers.get('If-None-Match');
      if (etag === requestEtag) {
        return response;
      } else {
        // O cache não é identico, deleta e busca a atualização
        caches.delete(CACHE_NAME, event.request).then(() => {
          return fetch(event.request);
        });
      }
    } else {
      // O recurso não está em cache, busca da rede
      return fetch(event.request);
    }
  }));
});