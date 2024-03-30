var CACHE_ALL = false;
var APP_NAME = "App"
var CACHE_VERSION = "0.1"
var CACHE_NAME = `${APP_NAME}_v${CACHE_VERSION}`;
var WHITELIST = [
  "/",
  "index.html",
  "manifest.json",
  "src/js/main.js",
  "src/css/main.css",
  "src/img/logo.svg",
  "src/img/logo.jpg",
  "src/img/favicon.ico",
  "src/img/animated_favicon.gif",
  "src/img/x48.png",
  "src/img/x72.png",
  "src/img/x96.png",
  "src/img/x128.png",
  "src/img/x192.png",
  "src/img/x384.png",
  "src/img/x512.png",
  "src/img/x1024.png"
]
var BLACKLIST = [];

self.addEventListener("fetch", function (e) {
  e.respondWith(
    caches.match(e.request).then(function (request) {
      return request || fetch(e.request);
    })
  )
});

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("[SW] installing cache : " + CACHE_NAME);
      return cache.addAll(WHITELIST)
    })
  )
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX)
      })
      cacheWhitelist.push(CACHE_NAME)
      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log("[SW] deleting cache : " + keyList[i]);
          return caches.delete(keyList[i]);
        }
      }));
    })
  )
});