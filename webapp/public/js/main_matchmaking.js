
import {client} from '/js/client.js';


export function init_app(conf, user) {
  client.init_game_client(conf.client, user, ()=>{

    gui.$refs.matchmaking.open();
  });
}
