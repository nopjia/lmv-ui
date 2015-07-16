(function() {
  Polymer({
    is: "lmv-ui",


    // ready

    attached: function() {
      if (!LMVUI._getViewerReference(this))
        return;

      this.hasAnimation = false;

      var self = this;

      // hook up to viewer events

      // load progress
      LMVUI._addViewerListener(this, Autodesk.Viewing.PROGRESS_UPDATE_EVENT, function(event) {
        self.loadProgress = event.percent / 100.0;
        self.isLoading = self.loadProgress < 1;
      });

      // init 2D/3D nav tool
      // TODO_NOP: should this be handled by viewer?
      LMVUI._addViewerListener(this, Autodesk.Viewing.MODEL_ROOT_LOADED_EVENT, function() {
        self.viewer.setDefaultNavigationTool(
          self.viewer.navigation.getIs2D() ? "pan" : "orbit"
        );
      });

      // property db loaded
      LMVUI._addViewerListener(this, Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, function() {
        self.hasAnimation = self.viewer.impl.model.myData.animations;
      });

      // geometry complete
      LMVUI._addViewerListener(this, Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function() {
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

    createPanel: function(title, elems) {
      var panel = new LMVUI.Panel(title);

      if (Array.isArray(elems)) {
        elems.forEach(function(e) {
          Polymer.dom(panel).appendChild(e);
        });
      }
      else {
        Polymer.dom(panel).appendChild(elems);
      }

      Polymer.dom(this.root).appendChild(panel);
    },

    openRenderStats: function() {
      var elem = new LMVUI.Table(this.renderStats);
      elem.right = true;
      this.createPanel("Render Stats", elem);
    },

    openModelTree: function() {
      var docTree = new LMVUI.DocTree();
      var modelSearch = new LMVUI.ModelSearch();
      var modelTree = new LMVUI.ModelTree();
      modelSearch.viewer = modelTree.viewer = this.viewer;
      this.createPanel("Model Structure", [docTree, modelSearch, modelTree]);
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
    },

    openAnimationPlayer: function() {
      var elem = new LMVUI.AnimationPlayer();
      elem.viewer = this.viewer;
      this.createPanel("Animation", elem);
    },

    detached: function() {
      LMVUI._cleanupViewerListeners(this);
    },

  });
})();