if (navigator.serviceWorker) {
    navigator.serviceWorker.register('/App/sw.js', {scope: '/App/'})
  }