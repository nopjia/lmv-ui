(function() {
  Polymer({
    is: "lmv-ui",


    // ready

    ready: function() {

      var self = this;

      // grab viewer reference

      this.viewerElem = this.querySelector("lmv-viewer");
      if (!this.viewerElem) {
        console.log("ERROR: Cannot find lmv-viewer element");
        return;
      }
      this.viewer = this.viewerElem.viewer;
      if (!this.viewer) {
        console.log("ERROR: Cannot find viewer from lmv-viewer element");
        return;
      }


      // hook up to viewer events

      // load progress
      this.viewer.addEventListener(Autodesk.Viewing.PROGRESS_UPDATE_EVENT, function(event) {
        self.loadProgress = event.percent;
      });

      // init 2D/3D nav tool
      // TODO_NOP: should this be handled by viewer?
      this.viewer.addEventListener(Autodesk.Viewing.MODEL_ROOT_LOADED_EVENT, function() {
        self.viewer.setDefaultNavigationTool(
          self.viewer.navigation.getIs2D() ? "pan" : "orbit"
        );
      });

      // property db loaded
      this.viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, function() {
        self.docName = self.viewerElem.doc ? self.viewerElem.doc.getRootItem().children[0].name : undefined;

        self.modelTree = self.viewer.model.getRoot();
        // go down to deepest single child
        // to get rid of single roots in model tree
        while (self.modelTree.children.length === 1) {
          self.modelTree = self.modelTree.children[0];
        }
      });

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
        self.renderStats.push(["Load time",       (self.viewer.impl.svfloader.loadTime/1000).toFixed(2) + " s"]);
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
      this.createPanel("Model Tree", new LMVUI.Tree(this.modelTree));
    },

    openModelProperty: function() {
      this.createPanel("Model Property", new LMVUI.PropertyView());
    },

  });
})();