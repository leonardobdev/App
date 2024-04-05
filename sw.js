
var CACHE_NAME = "App";
var URLS = [
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

URLS = URLS.map((v) => "/" + CACHE_NAME + v);

self.onfetch = async event => event.respondWith(
    caches.match(e.request).then(function (request) {
        console.log('[sw] fetching cache: ' + event.request.url);
        return request || fetch(e.request);
    })
);

self.oninstall = async event => event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
        console.log('[sw] installing cache: ' + CACHE_NAME);
        return cache.addAll(URLS);
    })
);

self.onactivate = async event => event.waitUntil(
    caches.keys().then(function (keyList) {
        var cacheWhitelist = keyList.filter(function (key) {
            return key.indexOf(CACHE_NAME)
        });
        cacheWhitelist.push(CACHE_NAME);
        return Promise.all(keyList.map(function (key, i) {
            if (URLS.indexOf(key) === -1) {
                console.log('[sw] deleting cache: ' + keyList[i]);
                return caches.delete(keyList[i])
            }
        }));
    })
);