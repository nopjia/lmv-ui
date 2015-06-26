(function() {
  Polymer({
    is: "lmv-sample",

    properties: {
      greeting: {
        type: String,
        value: "Hello",
        reflectToAttribute: true,
        observer: "greetingChanged",
      },
      first: {
        type: String,
        value: "Nancy"
      },
      last: {
        type: String,
        value: "Lee"
      },
      fullname: {
        type: String,
        computed: "computeFullname(first, last)"
      },
    },
    observers: [
      "somethingChanged(greeting, first, last)"
    ],

    listeners: {
      tap: "handleTap",
      track: "handleTrack"
    },


    // ready

    ready: function() {
      console.log("lmv-sample ready");
    },


    // computed properties

    computeFullname: function(first, last) {
      return first + " " + last;
    },


    // observers

    greetingChanged: function(newVal, oldVal) {
      console.log("greeting changed '" + oldVal + "' to '" + newVal + "'");
    },

    somethingChanged: function(greeting, first, last) {
      console.log("something changed: " + greeting + " " + first + " " + last);
    },


    // event listeners

    handleTap: function(e) {
      console.log("Tracking "+ "(" + e.detail.x + "," + e.detail.y + ")");
    },

    handleTrack: function(e) {
      switch(e.detail.state) {
        case "start":
          console.log("Tracking started");
          break;
        case "track":
          console.log("Tracking "+
            "(" + e.detail.x + "," + e.detail.y + ")\t" +
            "(" + e.detail.dx + "," + e.detail.dy + ")\t" +
            "(" + e.detail.ddx + "," + e.detail.ddy + ")\t"
          );
          break;
        case "end":
          console.log("Tracking ended");
          break;
      }
    },


    // functions

    onInput: function(e) {
      console.log("onInput " + e.target.value);
    },

  });
})();