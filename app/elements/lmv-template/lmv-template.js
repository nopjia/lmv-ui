(function() {
  LMVUI.Template = Polymer({
    is: "lmv-template",

    properties: {
      hello: {
        type: String,
        value: "Hello",
        reflectToAttribute: true,
        observer: "_helloChanged",
      }
    },

    ready: function() {
      console.log("lmv-template ready");
    },

    _helloChanged: function(newVal, oldVal) {
      console.log("hello changed '" + oldVal + "' to '" + newVal + "'");
    },
  });
})();