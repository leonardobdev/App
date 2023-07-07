const CACHE_NAME = 'testServiceworker-v1';

const addResourcesToCache = async (resources) => {
	const cache = await caches.open(CACHE_NAME);
	await cache.addAll(resources);
};
self.addEventListener("install", (event) => {
	event.waitUntil(
		addResourcesToCache([
			"/test/",
			'/test/index.html',
			'/test/src/css/style.css',
			'/test/src/img/logo.svg',
			'/test/app.js',
			'/test/manifest.js'
		])
	);
});
/*
self.addEventListener('activate', function activator(event) {
	event.waitUntil(
		caches.keys().then(function (keys) {
			return Promise.all(keys
				.filter(function (key) {
					return key.indexOf(CACHE_NAME) !== 0;
				})
				.map(function (key) {
					return caches.delete(key);
				})
			);
		})
	);
});

self.addEventListener('fetch', function (event) {
	event.respondWith(
		caches.match(event.request).then(function (cachedResponse) {
			return cachedResponse || fetch(event.request);
		})
	);
});
*/