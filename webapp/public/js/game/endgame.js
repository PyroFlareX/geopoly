import {client} from '/js/client.js';
import {countries} from '/engine/modules/worlds/world.js'
import {add_sys_message} from '/js/game/chat.js';


client.ws.on('Game:end_game', ({winner})=>{
  gui.dialog("game-end", winner);

  //gui.quit();
  //Vue.nextTick(() => {
  //});
});



client.ws.on('Game:surrender', ({iso})=>{
  // todo: do some code?
  countries[iso].shields = 0;

  add_sys_message(country.name + ' has surrendered!', iso);
});
