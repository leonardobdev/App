
var CACHE_NAME = "App";
var URLS = [
    "/",
    "/index.html",
    "/manifest.json",
    "/src/js/main.js",
    "/src/css/main.css",
    "/src/img/animated_favicon1.gif",
    "/src/img/favicon.ico",
    "/src/img/logo.jpg",
    "/src/img/logo.svg",
    "/src/img/x48.png",
    "/src/img/x72.png",
    "/src/img/x96.png",
    "/src/img/x128.png",
    "/src/img/x192.png",
    "/src/img/x384.png",
    "/src/img/x512.png",
    "/src/img/x1024.png",
];

self.oninstall = e => e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
        console.log('[sw] installing cache: ' + CACHE_NAME);
        return cache.addAll(URLS);
    })
);

URLS = URLS.map((v) => "/" + CACHE_NAME + v);

self.onfetch = e => e.respondWith(
    caches.match(e.request).then((request) => {
        if (request) {
            console.log('[sw] fetching from cache: ' + e.request.url);
            return request;
        } else {
            console.log('[sw] fetching from network: ' + e.request.url);
            return fetch(e.request);
        }
    })
);