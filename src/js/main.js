var isOnline = true;
var log = false;
var isWebAPK = window.matchMedia("(display-mode: standalone)").matches;
log && console.log("[*] The app is running as a " + (isWebAPK ? "WebAPK" : "Browser-Page"));

function checkOnlineStatus() {
  isOnline = navigator.onLine;
  log && console.log("[*] Connection status: " + (isOnline ? "online" : "offline"));
  if (isOnline) {
    log && console.log("[*] You are online!");
  }
  else {
    log && console.log("[*] You are offline!");
  }
}

function init() {
  if (navigator.serviceWorker) {
    log && console.log("[*] Register serviceWorker ...");
    navigator.serviceWorker.register("/App/sw.js", { scope: "/App/" }).then(function (registration) {
      log && console.log("[*] ServiceWorker registration successful with scope: ", registration.scope);
    }, function (err) {
      log && console.log("[*] ServiceWorker registration failed: ", err);
    });
  } else {
    log && console.log("[*] ServiceWorker not supported by your browser!");
  }

  window.addEventListener("beforeinstallprompt", function () {
    log && console.log("[*] WebAPK install event fired!");
  });

  checkOnlineStatus();
  window.addEventListener("online", checkOnlineStatus);
  window.addEventListener("offline", checkOnlineStatus);
}

init();