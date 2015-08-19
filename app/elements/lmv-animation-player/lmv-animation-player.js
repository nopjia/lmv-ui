(function() {
  LMVUI.AnimationPlayer = Polymer({
    is: "lmv-animation-player",

    properties: {
      time: {
        type: Number,
        value: 0,
        reflectToAttribute: true,
        observer: "_timeChanged",
      }
    },

    attached: function() {
      if (!LMVUI._getViewerReference(this))
        return;

      this._onPlay = this._onPlay.bind(this);

      this.reset();

      if (this.viewer.model && this.viewer.model.myData.animations) {
        this.loadAnimation();
      }

      var self = this;
      LMVUI._addViewerListener(this, Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, function() {
        self.unloadAnimation();
      });
      LMVUI._addViewerListener(this, Autodesk.Viewing.ANIMATION_READY_EVENT, function() {
        self.loadAnimation();
      });
    },
    loadAnimation: function() {
      this.animator = this.viewer.impl.keyFrameAnimator;
      this.$.timeline.max = this.animator.duration;
    },
    unloadAnimation: function() {
      this.reset();
      this.animator = undefined;
    },
    _timeChanged: function(value) {
      this.timeStr =
        LMVUI.formatInt(value / 60, 2) + ":" +
        LMVUI.formatInt(value % 60, 2) + ":" +
        LMVUI.formatInt(value * 100, 2);
    },
    _onSliderChange: function() {
      this.play(false);
      if (!this.animator)
        return;
      this.animator.goto(this.time);
    },
    reset: function() {
      this.play(false);
      this.time = 0;
    },
    prev: function() {
      this.play(false);
      if (!this.animator)
        return;
      this.animator.prev();
      this.time = this.animator.currentTime;
    },
    next: function() {
      this.play(false);
      if (!this.animator)
        return;
      this.animator.next();
      this.time = this.animator.currentTime;
    },
    play: function(play) {
      if (typeof(play) !== "boolean")
        this.playing = !this.playing;
      else if (play === this.playing)
        return;
      else
        this.playing = play;

      this.playIcon = this.playing ? "pause" : "play";

      if (!this.animator)
        return;

      if (this.playing)
        this.animator.play(0, this._onPlay);
      else
        this.animator.pause();
    },
    _onPlay: function() {
      this.time = this.animator.currentTime;
      if (this.time >= this.animator.duration)
        this.play(false);
    },

    detached: function() {
      LMVUI._cleanupViewerListeners(this);
    },
  });
})();