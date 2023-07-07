var APP_PREFIX = 'testServiceworker_'     // Identifier for this app (this needs to be consistent across every cache update)
var VERSION = 'v1'                        // Version of the off-line cache (change this value everytime you want to update cache)
var CACHE_NAME = APP_PREFIX + VERSION
var URLS = [                              // Add URL you want to cache in this list.
  '/test/',                               // If you have separate JS/CSS files,
  '/test/index.html',                     // add path to those files here
  '/test/src/css/style.css',
  '/test/src/img/logo.svg',
  '/test/app.js',
  '/test/manifest.json'
]

// Respond with cached resources
self.addEventListener('fetch', async function (e) {
  console.log('fetch request : ' + e.request.url)
  e.respondWith(
    caches.match(e.request).then(async function (request) {
      if (request) { // if cache is available, respond with cache
        console.log('responding with cache : ' + e.request.url)
        return request
      } else {       // if there are no cache, try fetching request
        console.log('file is not cached, fetching : ' + e.request.url)
        return fetch(e.request)
      }

      // You can omit if/else for console.log & put one line below like this too.
      // return request || fetch(e.request)
    })
  )
})

// Cache resources
self.addEventListener('install', async function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(async function (cache) {
      console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(URLS)
    })
  )
})

// Delete outdated caches
self.addEventListener('activate', async function (e) {
  e.waitUntil(
    caches.keys().then(async function (keyList) {
      // `keyList` contains all cache names under your username.github.io
      // filter out ones that has this app prefix to create white list
      var cacheWhitelist = keyList.filter(async function (key) {
        return key.indexOf(APP_PREFIX)
      })
      // add current cache name to white list
      cacheWhitelist.push(CACHE_NAME)

      return Promise.all(keyList.map(async function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('deleting cache : ' + keyList[i] )
          return caches.delete(keyList[i])
        }
      }))
    })
  )
})