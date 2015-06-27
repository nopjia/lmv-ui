// for debug
function stringToDOM(str) {
  var d = document.createElement("div");
  d.innerHTML = str;
  return d.firstChild;
}

(function(document) {
  "use strict";

  window.addEventListener("WebComponentsReady", function() {
    console.log("Web Components Ready");
  });

  var app = document.querySelector("#app");
  window.app = app;

  app.addEventListener("dom-change", function() {
    console.log("Polymer App Ready");
  });

})(document);
