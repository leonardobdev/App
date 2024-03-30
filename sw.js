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

self.addEventListener('fetch', event => {
  const request = event.request;

  // Verifica se o cache possui a requisição
  caches.match(request).then(response => {
    if (response) {
      // Verifica se o conteúdo do cache é idêntico à requisição
      fetch(request).then(updatedResponse => {
        if (updatedResponse.status === 200 && response.headers.get('etag') === updatedResponse.headers.get('etag')) {
          // O cache é idêntico, responde com o cache
          event.respondWith(response);
        } else {
          // O cache não é idêntico, exclui o cache e responde com o novo conteúdo
          caches.delete(request).then(() => {
            event.respondWith(updatedResponse);
            caches.add(request, updatedResponse);
          });
        }
      });
    } else {
      // O cache não possui a requisição, busca o novo conteúdo e o armazena
      fetch(request).then(response => {
        event.respondWith(response);
        caches.add(request, response);
      });
    }
  });
});