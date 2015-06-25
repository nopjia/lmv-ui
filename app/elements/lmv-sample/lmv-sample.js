(function() {
  Polymer({
    is: "lmv-sample",

    properties: {
      hello: {
        type: String,
        value: "LMV Rocks",
        notify: true
      }
    }
  });
})();