
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

// self.onactivate = async (event) => {
//     event.waitUntil(
//     );
// };

self.oninstall = async (event) => {
    event.waitUntil(
        await caches.open(CACHE_NAME).addAll(URLS)
    );
};

self.onfetch = async (event) => {
    event.respondWith(async () => {
        const responseFromCache = await caches.match(e.request);
        if (responseFromCache) {
            return responseFromCache;
        } else {
            const responseFromNetwork = await fetch(request.clone());
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, responseFromNetwork.clone());
            return responseFromNetwork;
        }
    }
    );
};