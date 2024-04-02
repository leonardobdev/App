
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

// const cs = {
//     open: (a) => {
//         return await caches.open(a);
//     },
//     save: (a, b) => {
//         return await cs.open(a).addAll(b);
//     },
//     load: (a) => {
//         return cs.open(a);
//     },
//     clear: (a) => {
//         caches.keys().then((b) => {
//             return Promise.all(
//                 b.map((c) => {
//                     if (!a.includes(c)) return caches.delete(c);
//                 }));
//         });
//     },
//     edit: () => { },
//     add: (a, b, c) => {
//         await cs.open(a).put(b, c);
//     },
//     sub: (a, b) => {
//         cs.clear(a);
//         cs.add(b);
//     },
//     find: (a) => {
//         return await caches.match(a);
//     },
//     combine: () => { }
// };

const addResourcesToCache = async (resources) => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(resources);
};

const putInCache = async (request, response) => {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise }) => {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
        return responseFromCache;
    }

    const preloadResponse = await preloadResponsePromise;
    if (preloadResponse) {
        putInCache(request, preloadResponse.clone());
        return preloadResponse;
    }

    try {
        const responseFromNetwork = await fetch(request.clone());
        putInCache(request, responseFromNetwork.clone());
        return responseFromNetwork;
    } catch (error) {
        return new Response('Network error happened', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' },
        });
    }
};

self.onactivate = (event) => {
    event.waitUntil(
        async () => {
            if (self.registration.navigationPreload) {
                await self.registration.navigationPreload.enable();
            }
        }
    );
};

self.oninstall = (event) => {
    event.waitUntil(
        addResourcesToCache(URLS)
    );
};

self.onfetch = (event) => {
    event.respondWith(
        cacheFirst({
            request: event.request,
            preloadResponsePromise: event.preloadResponse,
        })
    );
};