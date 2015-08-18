(function() {
  LMVUI.ButtonGroup = Polymer({
    is: "lmv-button-group",

    listeners: {
      "active-change": "_onActiveChange"
    },

    created: function() {
      this._currActive = null;
      this._handlingChange = false;
    },

    _onActiveChange: function(event) {
      // Avoid recursive calls
      if (this._handlingChange) return;
      this._handlingChange = true;

      var activating = event.detail.active;
      var btnClicked = event.target;

      var newActive, oldActive;
      if (activating) {
        oldActive = this._currActive;
        oldActive && (oldActive.active = false); // This instruction will cause a recursive call.
        newActive = btnClicked;
      } else {
        oldActive = btnClicked;
        newActive = null;
      }

      this._currActive = newActive;
      this._handlingChange = false;

      this.fire("active-group-change", {
        curr: newActive,
        prev: oldActive
      });
    }

  });
})();
