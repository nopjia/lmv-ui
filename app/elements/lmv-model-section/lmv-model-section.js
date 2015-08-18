(function() {
  LMVUI.ModelSection = Polymer({
    is: "lmv-model-section",

    listeners: {
      "active-group-change": "_onActiveGroupChange"
    },

    attached: function() {
      if (!LMVUI._getViewerReference(this))
        return;
    },

    _initTool: function() {

      // Attempt to initialize on first usage //
      if (this.tool) return;
      if (!this.viewer) return;
      if (!this.viewer.impl) return;

      this.tool = new Autodesk.Viewing.Extensions.Section.SectionTool(this.viewer);
      this.viewer.toolController.registerTool(this.tool);
      this.tool.setOutlineColor({r:1, g:0, b:0}); // default outline color to red per UX
    },

    _onActiveGroupChange: function(event) {

      this._initTool();
      if (!this.tool) return;

      var curr = event.detail.curr;
      var prev = event.detail.prev;

      if (curr) {
        if (!prev) {
          this.viewer.toolController.activateTool("section");
        }
        var sectionPlane = curr.dataset.plane;
        this.tool.setSection(sectionPlane);
      } else {
        this.viewer.toolController.deactivateTool("section");
      }

    },

  });
})();
