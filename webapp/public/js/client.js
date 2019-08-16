import {ws_client} from '/engine/modules/websocket/wsclient.js';
import {offline_request} from '/js/solo/handler.js';

// import {AreasController} from '/js/controllers/areas.js';
// import {WorldsController} from '/js/controllers/worlds.js';
// import {AreasGroup} from '/js/groups/areas.js';
// import {WorldsGroup} from '/js/groups/worlds.js';

export const client = {
  controllers: {
    // Areas: new AreasController(),
    // Worlds: new WorldsController(),
  },

  groups: {
    //Areas: new AreasGroup(),
    //Worlds: new WorldsGroup(),    
  },

  ws: ws_client,

  init_game_client: function(conf, user) {
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
        }, ()=>{
          //...
        });
      });
    } else {
      this.ws.request = offline_request;
    }

    if (conf.debug) {
      window.client = client;
    }
  }
};
