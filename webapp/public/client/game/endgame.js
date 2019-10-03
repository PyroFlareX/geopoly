import {client} from '/client/websocket.js';
import {countries} from '/engine/modules/worlds/world.js'
import {add_sys_message} from '/client/game/chat.js';


client.ws.on('Game:end_game', ({winner})=>{
  gui.dialog("game-end", winner);
});



client.ws.on('Game:surrender', ({iso})=>{
  // todo: do some code?
  countries[iso].shields = 0;

  add_sys_message(country.name + ' has surrendered!', iso);
});