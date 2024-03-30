var APP_PREFIX = 'App_'
var VERSION = 'v0.1'
var CACHE_NAME = APP_PREFIX + VERSION
var URLS = [
  '/App/',
  '/App/index.html',
  '/App/manifest.json',
  '/App/src/js/main.js',
  '/App/src/css/main.css',
  '/App/src/img/logo.svg',
  '/App/src/img/logo.jpg',
  '/App/src/img/favicon.ico',
  '/App/src/img/animated_favicon.gif',
  '/App/src/img/x48.png',
  '/App/src/img/x72.png',
  '/App/src/img/x96.png',
  '/App/src/img/x128.png',
  '/App/src/img/x192.png',
  '/App/src/img/x384.png',
  '/App/src/img/x512.png',
  '/App/src/img/x1024.png'
]

self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (request) {
      return request || fetch(e.request)
    })
  )
})

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(URLS)
    })
  )
})

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX)
      })
      cacheWhitelist.push(CACHE_NAME)
      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('deleting cache : ' + keyList[i])
          return caches.delete(keyList[i])
        }
      }))
    })
  )
})