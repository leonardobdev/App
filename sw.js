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


self.addEventListener('fetch', async (event) => {

  event.respondWith(

    caches.match(event.request).then(
      async (request) => {

        var requestEtag = event.request.headers.get('If-None-Match');
        var etag = request.headers.get('ETag');

        if (etag === requestEtag) {

          return request

        } else {

          var response = fetch(e.request).then(async () => {

            caches.open(CACHE_NAME).then(async (cache) => {

              cache.delete(event.request).then(async () => {

                cache.put(event.request, response).then(async () => {

                  return response;

                })
              })
            });
          })
        }
      }
    )
  )
}
);