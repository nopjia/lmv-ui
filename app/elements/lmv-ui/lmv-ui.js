(function() {
  Polymer({
    is: "lmv-ui",


    // ready

    attached: function() {
      if (!LMVUI._getViewerReference(this))
        return;

      var self = this;

      // hook up to viewer events

      // load progress
      this.viewer.addEventListener(Autodesk.Viewing.PROGRESS_UPDATE_EVENT, function(event) {
        self.loadProgress = event.percent;
        self.isLoading = self.loadProgress < 100;
      });

      // init 2D/3D nav tool
      // TODO_NOP: should this be handled by viewer?
      this.viewer.addEventListener(Autodesk.Viewing.MODEL_ROOT_LOADED_EVENT, function() {
        self.viewer.setDefaultNavigationTool(
          self.viewer.navigation.getIs2D() ? "pan" : "orbit"
        );
      });

      // property db loaded
      // this.viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, function() {
      //   self.docName = self.viewerElem.doc ? self.viewerElem.doc.getRootItem().children[0].name : undefined;
      // });

      // geometry complete
      this.viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function() {
        // set render stats
        var geomList = self.viewer.impl.modelQueue().getGeometryList();
        self.renderStats = [];
        self.renderStats.push(["Meshes",          geomList.geoms.length]);
        self.renderStats.push(["Fragments",       self.viewer.impl.modelQueue().getFragmentList().getCount()]);
        self.renderStats.push(["Instanced Polys", geomList.instancePolyCount.toLocaleString()]);
        self.renderStats.push(["Geometry Polys",  geomList.geomPolyCount.toLocaleString()]);
        self.renderStats.push(["Geometry Size",   (geomList.geomMemory/(1024*1024)).toFixed(2) + " MB"]);
        // self.renderStats.push(["Load time",       (self.viewer.impl.svfloader.loadTime/1000).toFixed(2) + " s"]);
      });
    },

    createPanel: function(title, elem) {
      var panel = new LMVUI.Panel(title);
      Polymer.dom(panel).appendChild(elem);
      Polymer.dom(this.root).appendChild(panel);
    },

    openRenderStats: function() {
      var elem = new LMVUI.Table(this.renderStats);
      elem.right = true;
      this.createPanel("Render Stats", elem);
    },

    openModelTree: function() {
      var elem = new LMVUI.ModelTree();
      elem.viewer = this.viewer;
      this.createPanel("Model Tree", elem);
    },

    openModelProperty: function() {
      var elem = new LMVUI.PropertyView();
      elem.viewer = this.viewer;
      this.createPanel("Model Property", elem);
    },

    openRenderSettings: function() {
      var elem = new LMVUI.RenderSettings();
      elem.viewer = this.viewer;
      this.createPanel("Render Settings", elem);
    }

  });
})();