
var isOnline = true;
var isWebAPK = window.matchMedia('(display-mode: standalone)').matches;

if ('serviceWorker' in navigator) {
  if (navigator.serviceWorker) {
    console.log("Register serviceWorker ...");
    navigator.serviceWorker.register('/App/src/js/sw.js', { scope: '/App/' }).then(function (registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function (err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  }
}
else console.log("ServiceWorker not supported by your browser!");