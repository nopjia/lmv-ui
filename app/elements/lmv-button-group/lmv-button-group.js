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
      if (this._handlingChange) // Avoid recursive calls
        return;

      this._handlingChange = true;

      var btnClicked = event.target;

      var newActive, oldActive;
      if (event.detail.active) {
        oldActive = this._currActive;
        if (oldActive)
          oldActive.active = false;  // This instruction will cause a recursive call
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
