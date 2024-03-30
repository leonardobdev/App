window.addEventListener("load", function() {
  var isOnline = true;
  var isWebAPK = window.matchMedia('(display-mode: standalone)').matches;
  console.log("[*] The app is running as a "+(isWebAPK?"WebAPK":"Browser-Page"));
  
  function checkOnlineStatus(){
    isOnline = navigator.onLine;
    console.log("[*] Connection status: "+(isOnline?"online":"offline"));
    if (isOnline){
      $("#connection abbr").html("&#128246;");
      $("#connection abbr").attr("title","You are online!");
    }
    else {
      $("#connection abbr").html("&#9888;");
      $("#connection abbr").attr("title","You are offline!");
    }
  }
  
  function init(){
    if ('serviceWorker' in navigator) {
      console.log("[*] Register serviceWorker ...");
      navigator.serviceWorker.register('/App/src/js/sw.js', { scope: './App/' }).then(function(registration) {
        console.log('[*] ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        console.log('[*] ServiceWorker registration failed: ', err);
      });
    }
    else console.log("[*] ServiceWorker not supported by your browser!");
    
    window.addEventListener("beforeinstallprompt",function(event){
      console.log("[*] WebAPK install event fired!");
      var btn = $("<button style='display: none;'>install</button>");
      document.body.append(btn);
      btn.click(function(e){
        event.prompt();
        btn.remove();
      });
    });
    
    checkOnlineStatus();
    window.addEventListener("online",checkOnlineStatus);
    window.addEventListener("offline",checkOnlineStatus);
  }
  
  init();
});