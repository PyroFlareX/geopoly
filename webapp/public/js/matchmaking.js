import {client} from '/js/game/client.js';
import {gui} from '/js/vue/gui.js';

import {MatchesGroup} from '/js/game/groups/matches.js';


export function init_app(debug, ws_address, uid, token) {

  window.gui = gui;

  client.groups.Matches = new MatchesGroup(client);


  client.connect(ws_address, () => {
    client.request("Users:guest", {uid: uid}).then(({err}) =>{
      if (err) {
        console.error(err);
        return
      }
      
      client.groups.Matches.request_list();
    });
  });
}
