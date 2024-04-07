
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

self.oninstall = async () => {
    console.log('[sw] installing cache: ' + CACHE_NAME);
    let cache = await caches.open(CACHE_NAME);
    let response = await cache.addAll(URLS);
    e.waitUntil(response);
    return;
};

URLS = URLS.map((v) => "/" + CACHE_NAME + v);

self.onfetch = async event => {
    let request = event.request;
    let cachedResponse = await caches.match(request);
    let updatedResponse = await fetch(request);
    let response = '';
    
    if (cachedResponse) {

        if (updatedResponse.status === 200) {

            let cachedEtag = cachedResponse.headers.get('etag');
            let updatedEtag = updatedResponse.headers.get('etag');

            if (cachedEtag === updatedEtag) {

                response = cachedResponse

            } else {

                response = updatedResponse;
                await caches.delete(request);
                await caches.add(request, updatedResponse);

            }

        }

    } else {
        
        response = updatedResponse;
        
    }

    event.respondWith(response);
    return;
};