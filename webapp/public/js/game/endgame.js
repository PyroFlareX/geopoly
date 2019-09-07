import {client} from '/js/client.js';


client.ws.on('Game:end_game', ({winner})=>{
  gui.infobar("close");
  gui.dialog("close");
  gui.overlay("close");

  gui.dialog("game-end", winner);
});
