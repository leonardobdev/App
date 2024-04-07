
var log = true;
var CACHE_NAME = 'App';
var URLS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/sw.js',
    '/src/js/main.js',
    '/src/css/main.css',
    '/src/img/animated_favicon1.gif',
    '/src/img/favicon.ico',
    '/src/img/logo.jpg',
    '/src/img/logo.svg',
    '/src/img/x48.png',
    '/src/img/x72.png',
    '/src/img/x96.png',
    '/src/img/x128.png',
    '/src/img/x192.png',
    '/src/img/x384.png',
    '/src/img/x512.png',
    '/src/img/x1024.png',
];

URLS = URLS.map((v) => '/' + CACHE_NAME + v);

self.oninstall = async () => {

    self.skipWaiting();

    log && console.log('[sw] installing cache: ' + CACHE_NAME);
    let cache = await caches.open(CACHE_NAME);

    await cache.addAll(URLS);

    return;

};

self.onfetch = async event => {
    event.respondWith(
        caches.open(CACHE_NAME).then(
            async (cache) => {

                let request = event.request;
                let cachedResponse = await cache.match(request);
                let response = updatedResponse;

                if (cachedResponse) {

                    if (navigator.onLine) {

                        let updatedResponse = await fetch(request);

                        if (updatedResponse.status === 200) {

                            let cachedEtag = cachedResponse.headers.get('etag');
                            let updatedEtag = updatedResponse.headers.get('etag');

                            if (cachedEtag === updatedEtag) {

                                log && console.log('[sw] fetching from cache: ' + request.url);
                                response = cachedResponse

                            } else {

                                log && console.log('[sw] deleting from cache: ' + request.url);
                                await cache.delete(request);

                                log && console.log('[sw] adding on cache: ' + request.url);
                                await cache.add(request, updatedResponse);

                                log && console.log('[sw] fetching from network: ' + request.url);
                                response = updatedResponse;

                            }

                        } else {

                            log && console.log('[sw] deleting from cache: ' + request.url);
                            await cache.delete(request);

                        }

                    } else {

                        log && console.log('[sw] fetching from cache: ' + request.url);
                        response = cachedResponse

                    }

                } else {

                    if (navigator.onLine) {

                        let updatedResponse = await fetch(request);

                        if (updatedResponse.status !== 200) {

                            log && console.log('[sw] deleting from cache: ' + request.url);
                            await cache.delete(request);

                        }

                        log && console.log('[sw] fetching from network: ' + request.url);
                        response = updatedResponse;

                    }

                }

                return response;

            })
    );
};