(function() {
  Polymer({
    is: "lmv-ui",

    attached: function() {
      if (!LMVUI._getViewerReference(this)) return;
      this.viewerElem = this.viewerElem || LMVUI.getViewerElem();

      this.hasAnimation = false;
      this.hasDoc = false;

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
        self.hasDoc = !!self.viewerElem.doc;
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

      return panel;
    },

    createRenderStats: function() {
      var elem = new LMVUI.Table(this.renderStats);
      elem.right = true;
      return this.createPanel("Render Stats", elem);
    },

    createModelTree: function() {
      var modelSearch = new LMVUI.ModelSearch();
      var modelTree = new LMVUI.ModelTree();
      modelSearch.viewer = modelTree.viewer = this.viewer;
      return this.createPanel("Model Structure", [modelSearch, modelTree]);
    },

    createModelProperty: function() {
      var elem = new LMVUI.ModelProperty();
      elem.viewer = this.viewer;
      return this.createPanel("Model Property", elem);
    },

    createRenderSettings: function() {
      var elem = new LMVUI.RenderSettings();
      elem.viewer = this.viewer;
      return this.createPanel("Render Settings", elem);
    },

    createAnimationPlayer: function() {
      var elem = new LMVUI.AnimationPlayer();
      elem.viewer = this.viewer;
      return this.createPanel("Animation", elem);
    },

    createDocTree: function() {
      var elem = new LMVUI.DocTree();
      elem.viewer = this.viewer;
      elem.viewerElem = this.viewerElem;
      return this.createPanel(this.viewerElem.doc.getRootItem().children[0].name, elem);
    },

    createLiveReview: function() {
      var elem = new LMVUI.CollabView();
      elem.viewer = this.viewer;
      elem.viewerElem = this.viewerElem;
      return this.createPanel("Live Review", elem);
    },

    togglePanel: function(e) {
      var button = e.currentTarget;
      var name = button.getAttribute("panel");

      if (!this._openedPanels)
        this._openedPanels = {};

      var panels = this._openedPanels;

      if (!e.detail.active) {
        if (panels[name])
          panels[name].hidden = true;
      }
      else {
        if (panels[name]) {
          panels[name].hidden = false;
        }
        else {
          var panel = panels[name] = this["create"+name]();
          panel.close = function() {
            this.hidden = true;
            button.active = false;
          };
        }
      }
    },

    detached: function() {
      LMVUI._cleanupViewerListeners(this);
    },

  });
})();