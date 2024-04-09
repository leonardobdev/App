
var log = false;
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
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(event.request);
    const response = navigator.onLine
        ? cachedResponse?.clone() || await fetch(event.request)
        : cachedResponse;
    if (navigator.onLine && cachedResponse && event.request.method !== 'POST') {
        const updatedResponse = await fetch(event.request);
        if (updatedResponse.ok && !await compareEtags(cachedResponse, updatedResponse)) {
            await cache.put(event.request, updatedResponse.clone());
        }
    }
    return response;
};

async function compareEtags(response1, response2) {
    const etag1 = response1.headers.get('etag');
    const etag2 = response2.headers.get('etag');
    return etag1 === etag2;
}