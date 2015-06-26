(function(document) {
  "use strict";

  var app = document.querySelector("#app");
  window.app = app;

  app.addEventListener("dom-change", function() {
    console.log("Polymer App Ready");
  });

  app.keyPressed = function(e) {
    console.log("Pressed " + e.detail.combo);
  };

  window.addEventListener("WebComponentsReady", function() {
    console.log("Web Components Ready");
  });

})(document);
