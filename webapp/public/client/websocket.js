import {ws_client} from '/engine/modules/websocket/wsclient.js';
import {offline_request} from '/client/game/solo_handler.js';

export const client = {
  controllers: {
  },

  groups: {
  },

  ws: ws_client,

  init_game_client: function(conf, user, cb) {
    this.conf = conf;

    if (conf.websocket) {
      this.ws.groups = this.groups;

      this.ws.connect(conf.ws_address, ()=>{
        this.request_auth(user, cb);
      });

      this.ws.onerror((event)=>{
        console.error(event);
      });

      this.ws.ondisconnect((event)=>{
        if (gui.opened != 'disconnect')
          gui.dialog('disconnect', 'reconnect');

        // try reconnecting
        this.ws.tryReconnect(1, ()=>{
          this.request_auth(user, ()=>{
            gui.$refs['dialog-disconnect'].onReconnect();
          });
        }, ()=>{
          // couldn't reconnect
          gui.$refs['dialog-disconnect'].onFailed();
        }, ()=>{
          // reconnect attempt
          gui.$refs['dialog-disconnect'].onAttempt();
        });
      });

    } else {
      this.ws.request = offline_request;
    }

    if (conf.debug) {
      window.client = client;
    }
  },

  request_auth: function({uid, token}, cb) {
    // init WS auth
    const r = this.ws.request("Users:auth_token", {
      uid: uid,
      token: token,
    })

    if (cb != null)
      r.then(cb);
  }
};
