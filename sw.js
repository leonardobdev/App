const cacheName = "MyFancyCacheName_v1";

const precachedAssets = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/logo.png"
];

self.oninstall = (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
     cache.addAll(precachedAssets);
    }
  ));
};

self.onactivate = (event) => {
  const cacheAllowlist = ["v2"];
  event.waitUntil(
    caches.forEach((cache, cacheName) => {
      if (!cacheAllowlist.includes(cacheName)) {
        return caches.delete(cacheName);
      }
    })
  );
};

self.onfetch = (event) => {
  event.respondWith(caches.open(cacheName).then((cache) => {
    return cache.match(event.request.url) || fetch(event.request.url);
  }));
};