const cacheName = "MyFancyCacheName_v1";

const precachedAssets = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/logo.png"
];

self.addEventListener("install", function() {
  event.waitUntil(caches.open(cacheName).then((cache) => {
    cache.addAll(precachedAssets);
  }));
});

self.addEventListener("activate", (event) => {
  const cacheAllowlist = ["v2"];

  event.waitUntil(
    caches.forEach((cache, cacheName) => {
      if (!cacheAllowlist.includes(cacheName)) {
        return caches.delete(cacheName);
      }
    })
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const isPrecachedRequest = precachedAssets.includes(url.pathname);

  if (isPrecachedRequest) {
    event.respondWith(caches.open(cacheName).then((cache) => {
      return cache.match(event.request.url);
    }));
  } else {
    return;
  }
});