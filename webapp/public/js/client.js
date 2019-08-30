import {ws_client} from '/engine/modules/websocket/wsclient.js';
import {offline_request} from '/js/solo/handler.js';

export const client = {
  controllers: {
    // Areas: new AreasController(),
    // Worlds: new WorldsController(),
  },

  groups: {
    //Areas: new AreasGroup(),
   //Worlds: new WorldsGroup(ws_client),    
  },

  ws: ws_client,

  init_game_client: function(conf, user, cb) {
    this.conf = conf;

    if (conf.websocket) {
      this.ws.groups = this.groups;

      this.ws.connect(conf.ws_address, ()=>{

        // init WS auth
        this.ws.request("Users:guest", {
          wid: user.wid,
          uid: user.uid,
          iso: user.iso,
          username: user.username,
        }).then(cb||(()=>{}));
      });
    } else {
      this.ws.request = offline_request;
    }

    if (conf.debug) {
      window.client = client;
    }
  }
};
