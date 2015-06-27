(function() {
  Polymer({
    is: "lmv-template",

    properties: {
      greeting: {
        type: String,
        value: "Hello",
        reflectToAttribute: true,
        observer: "greetingChanged",
      }
    },

    ready: function() {
      console.log("lmv-template ready");
    },

    greetingChanged: function(newVal, oldVal) {
      console.log("greeting changed '" + oldVal + "' to '" + newVal + "'");
    },
  });
})();