var isOnline = true;
var isWebAPK = window.matchMedia("(display-mode: standalone)").matches;
console.log("[*] The app is running as a " + (isWebAPK ? "WebAPK" : "Browser-Page"));

function checkOnlineStatus() {
  isOnline = navigator.onLine;
  console.log("[*] Connection status: " + (isOnline ? "online" : "offline"));
  if (isOnline) {
    console.log("[*] You are online!");
  }
  else {
    console.log("[*] You are offline!");
  }
}

function init() {
  if (navigator.serviceWorker) {
    console.log("[*] Register serviceWorker ...");
    navigator.serviceWorker.register("/App/sw.js", { scope: "/App/" }).then(function (registration) {
      console.log("[*] ServiceWorker registration successful with scope: ", registration.scope);
    }, function (err) {
      console.log("[*] ServiceWorker registration failed: ", err);
    });
  } else {
    console.log("[*] ServiceWorker not supported by your browser!");
  }

  window.addEventListener("beforeinstallprompt", function () {
    console.log("[*] WebAPK install event fired!");
  });

  checkOnlineStatus();
  window.addEventListener("online", checkOnlineStatus);
  window.addEventListener("offline", checkOnlineStatus);
}

init();