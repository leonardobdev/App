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

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(
      function (cache) {
        return cache.addAll(WHITELIST);
      }
    )
  );
});


self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(
      function (response) {
        if (response) return response;
        else if (!CACHE_ALL || BLACKLIST.indexOf(event.request) !== -1) return fetch(event.request);
        else {
          fetch(event.request).then(
            function (response) {
              if (!response || response.status !== 200 || response.type !== 'basic') return response;
              var responseToCache = response.clone();
              caches.open(CACHE_NAME).then(
                function (cache) {
                  cache.put(event.request, responseToCache);
                }
              );
              return response;
            }
          );
        }
      }
    )
  );
});