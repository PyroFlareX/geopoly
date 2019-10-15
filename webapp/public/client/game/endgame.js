import {client} from '/client/websocket.js';
import {world, countries} from '/engine/modules/worlds/world.js'
import {add_sys_message, play_sfx} from '/client/game/notifications.js';


client.ws.on('Game:end_game', ({winner})=>{
  if (winner == world.me)
    play_sfx("victory");

  gui.dialog("game-end", winner);
});



client.ws.on('Game:surrender', ({iso})=>{
  // todo: do some code?
  countries[iso].shields = 0;

  add_sys_message("surrender", iso, country.name);
});
