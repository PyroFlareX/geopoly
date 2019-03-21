// websocket client to communicate with game server

export let client = new (function(){
  this.groups = {};
  this.model = {};
  this.subscribed = {};
  this.reoccuring = {};
  this.ws = null;
  this.log_style = "color: purple";
  this.address = null;
  this.trying = false;
  this.request = function(route, params) {
    if (!params && typeof route !== 'string') {
        var params = route;
    } else {
        if (!params) params = {};
        params.route = route;
    }

    if (!params.route)
        console.error("No route defined for request: ", params);

    console.log('%c<' + route, client.log_style, params);
    var rwsString = JSON.stringify(params);
    try {
      this.ws.send(rwsString);
      return new DeferredResponse(route);
    } catch(e){
      console.error(e);
      client.reconnect();
    }
  };

  this.on = function(route, callback) {
    this.reoccuring[route] = callback;
  };

  this.connect = function(serveraddress, callback) {
    this.address = serveraddress;

    this.ws = new WebSocket(serveraddress);
    this.ws.onopen = function(event) {
      console.log("%cConnected to websocket", client.log_style);
      callback();
    };
    this.ws.onerror = function(event) {
      console.error(event);
    };
    this.ws.onclose = function(event) {
      console.log("%cDisconnected from websocket", client.log_style);

      // todo: display disconnected message
      if (client.disconnected)
        client.disconnected();
      //client.reconnect();
    };
    this.ws.onmessage = function(event) {
      var rws = JSON.parse(event.data);
      console.log('%c>'+rws.route, "color:purple", rws);

      try {
        var gmarr = rws.route.split(':');
        var group = client.groups[gmarr[0]] || this;

        try {
            var params = Object.assign({}, rws);
            delete params.route;
        } catch(e) {
            var params = rws;
        }

        if (params.params)
            params = params.params;

        if (client.subscribed[rws.route]) {
            // events handled by request().then(...)
            client.subscribed[rws.route].apply(group, [params]);
            delete client.subscribed[rws.route];
        }

        if (client.reoccuring[rws.route]) {
            // events handled by client.on(...)
            client.reoccuring[rws.route].apply(group, [params]);
        }

        var action = group[gmarr[1]];

        if (action) {
            // events handled by groups
            action.apply(group, [params]);
        }
      } catch (e) {
        console.error(e);

        //client.reconnect();
      }
    }
  };
  this.reconnect = function() {
    if (!client.trying) {
      client.tryReconnect();
    }
  };
  this.tryReconnect = function() {

    if (client.ws.readyState !== client.ws.OPEN) {
      client.trying = true;

      console.log("%cTrying to reconnect..", client.log_style)
      client.connect(client.address, function(){
        client.trying = false;
        console.log("%cReconnect successful", client.log_style);
      });

      setTimeout(client.tryReconnect, 4000);
    } else {
      //console.log("Reconnect successful");
    }
  }
})();


var DeferredResponse = function(route) {
    this.then = function(callback) {
        client.subscribed[route] = callback;
    }
};