(function() {

  var Rtc = function(viewer) {
    var scope = this;

    this.join = function(sessionId) {
      scope.client = Autodesk.Viewing.Private.MessageClient.GetInstance();
      scope.presenceChannelId = window.location.host;
      if (!scope.client.isConnected()) {
        scope.client.connect(sessionId);
        console.log("WebView RTC connect to session: " + sessionId);
      }

      scope.viewtx = new Autodesk.Viewing.Extensions.Collaboration.ViewTransceiver(scope.client);
      scope.interceptor = new Autodesk.Viewing.Extensions.Collaboration.InteractionInterceptor(scope.viewtx);

      viewer.toolController.registerTool(scope.interceptor);

      scope.p2p = new Autodesk.Viewing.Private.P2PClient(scope.client);
      scope.viewtx.channelId = sessionId;
      scope.viewtx.attach(viewer);
      scope.client.join(scope.viewtx.channelId);
      console.log("join channelId " + scope.viewtx.channelId);
      viewer.toolController.activateTool(scope.interceptor.getName());

      // fixme: hack.
      scope.viewtx.takeControl();
    };

    this.leave = function() {
      scope.p2p.hangup();
      scope.viewtx.detach(viewer);
      scope.client.disconnect();
    };
  };

  LMVUI.CollabView = Polymer({
    is: "lmv-collab-view",

    attached: function() {
      if (!LMVUI._getViewerReference(this)) return;
      this.viewerElem = this.viewerElem || LMVUI.getViewerElem();

      this._onUserListChange = this._onUserListChange.bind(this);
      this._onChatReceived = this._onChatReceived.bind(this);
      this._onControlChange = this._onControlChange.bind(this);

      this.connected = false;
    },

    _onStart: function(e) {
      e.preventDefault();

      if (!this.$.username.value)
        return;

      Autodesk.Viewing.Private.setUserName(this.$.username.value);

      this.viewer.loadExtension("Autodesk.Viewing.Collaboration");

      // TODO_NOP: arbitrary session id for now
      var sessionId = window.location.origin + "|" + this.viewerElem.url;

      this.rtc = new Rtc(this.viewer);
      this.rtc.join(sessionId);
      this.rtc.client.addEventListener("userListChange", this._onUserListChange);
      this.rtc.client.addEventListener("chatReceived", this._onChatReceived);
      this.rtc.viewtx.addEventListener("controlChange", this._onControlChange);

      this.$.users.innerHTML = "";
      this.$.chats.innerHTML = "";

      this.connected = true;
    },

    _onChatSubmit: function(e) {
      e.preventDefault();

      if (!this.$.chatbox.value)
        return;

      this.rtc.client.sendChatMessage(this.$.chatbox.value, this.rtc.viewtx.channelId);
      this.$.chatbox.value = "";
    },

    // rtc events

    _onChatReceived: function(e) {
      if (e.channelId && e.channelId !== this.rtc.viewtx.channelId)
        return;

      if (e.data.msg.indexOf("/") === 0)
        return;

      var chatMsg = e.data.msg;
      var chatterId = e.data.from;
      var chatUser = this.rtc.client.getUserById(e.data.from, e.channelId);

      var userTag = "";
      if (chatterId !== this.lastChatterId) {
        userTag = "<span class=user-msg>"+chatUser.name+"</span>";
        this.lastChatterId = chatterId;
      }

      this.$.chats.innerHTML += userTag + chatMsg + "<br>";
      this.$.chats.scrollTop = this.$.chats.scrollHeight;
    },

    _onUserListChange: function(e) {
      if (e.channelId && e.channelId !== this.rtc.viewtx.channelId)
        return;
      var ci = this.rtc.client.getChannelInfo(this.rtc.viewtx.channelId);
      if (!ci)
        return;

      /* jshint ignore:start */

      var users = ci.users;
      var htmlString = "";
      for (var i=0; i<users.length; i++) {
        var uid = users[i].id;
        var uname = users[i].name;
        var classStr = "user" + (this.lastControlId === uid ? " active" : "");

        htmlString += '<div class="'+classStr+'" uid='+uid+'>'+uname+'</div>';
      }
      this.$.users.innerHTML = htmlString;

      /* jshint ignore:end */
    },

    _onControlChange: function(e) {
      if (e.channelId && e.channelId !== this.rtc.viewtx.channelId)
        return;

      this.lastControlId = e.data.lastInControl;
      var userDoms = this.$.users.children;
      for (var i=0; i<userDoms.length; i++) {
        if (userDoms[i].getAttribute("uid") === this.lastControlId) {
          userDoms[i].classList.add("active");
        }
        else {
          userDoms[i].classList.remove("active");
        }
      }
    },

  });
})();