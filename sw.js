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

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // Next try to use (and cache) the preloaded response, if it's there
  const preloadResponse = await preloadResponsePromise;
  if (preloadResponse) {
    console.info("using preload response", preloadResponse);
    putInCache(request, preloadResponse.clone());
    return preloadResponse;
  }

  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request);
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache(WHITELIST),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      preloadResponsePromise: event.preloadResponse
    }),
  );
});