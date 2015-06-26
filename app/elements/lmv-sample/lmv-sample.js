(function() {
  Polymer({
    is: "lmv-sample",

    properties: {
      hello: {
        type: String,
        value: "LMV Rocks"
      }
    },

    onInput: function() {
      console.log("onInput" + this.hello);
    },
  });
})();