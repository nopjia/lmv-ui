(function() {
  LMVUI.Panel = Polymer({
    is: "lmv-panel",

    properties: {
      header: {
        type: String,
        value: "Header",
        reflectToAttribute: true,
      },
      collapse: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },
      _dragged: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },
      noCollapse: {
        type: Boolean,
        value: false
      },
      noClose: {
        type: Boolean,
        value: false
      },
      noDrag: {
        type: Boolean,
        value: false
      },
      noResize: {
        type: Boolean,
        value: false
      },
    },

    factoryImpl: function(header) {
      this.header = header || this.header;
    },

    toggleCollapse: function() {
      this.collapse = !this.collapse;
      this.fire("collapse", { collapse: this.collapse });
    },

    close: function() {
      Polymer.dom(this.parentNode).removeChild(this);
      this.fire("close");
    },

    reset: function() {
      this.removeAttribute("style");
      this.$.content.removeAttribute("style");
    },

    _onDrag: function(e) {
      if (this.noDrag)
        return;

      switch(e.detail.state) {
        case "start":
          var rect = this.getBoundingClientRect();
          this._dragged = true;
          this._top = rect.top;
          this._left = rect.left;
          break;
        case "track":
          // update pos
          this._top += e.detail.ddy;
          this._left += e.detail.ddx;
          // check bounds
          var BOUNDS_PAD = 50;  // don't want to do getBoundingClientRect every frame
          this._top = Math.max(Math.min(this._top, window.innerHeight-BOUNDS_PAD), 0.0);
          this._left = Math.max(Math.min(this._left, window.innerWidth-BOUNDS_PAD), 0.0);
          // update css
          this.style.top = this._top + "px";
          this.style.left = this._left + "px";
          break;
      }
    },

    _onResizeDrag: function(e) {
      var elem = this.$.content;
      switch(e.detail.state) {
        case "start":
          // note: adjust width in panel and height in content
          var rect = this.getBoundingClientRect();
          var elemRect = elem.getBoundingClientRect();
          this._width = rect.width;
          this._height = elemRect.height; // content height
          // first time
          if (!this._resized) {
            this._resized = true;
            // fix panel size styles
            this.style.width = "initial";
            this.style.height = "initial";
            this.style.maxWidth = "none";
            this.style.maxHeight = "none";
            this.style.minWidth = this._width + "px";  // set current width as min width
            // fix panel position
            this.style.top = rect.top + "px";
            this.style.left = rect.left + "px";
            this.style.right = "initial";
            this.style.bottom = "initial";
            // set size
            this.style.width = this._width + "px";
            elem.style.height = this._height + "px";
          }
          break;
        case "track":
          this._width += e.detail.ddx;
          this._height += e.detail.ddy;
          this.style.width = this._width + "px";
          elem.style.height = this._height + "px";
          break;
      }
    },

  });
})();