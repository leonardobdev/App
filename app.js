if (navigator.serviceWorker) {
    navigator.serviceWorker.register('/test/sw.js', {scope: '/test/'})
  }