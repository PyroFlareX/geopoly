
import {client} from '/client/websocket.js';


export function init_app(conf, user, wid_url) {
  client.init_game_client(conf.client, user, ()=>{

    gui.$refs.matchmaking.open(user.wid||wid_url);
  });
}



export function init_playtest(users) {
  gui.$refs.playtesting.open(users);
}
