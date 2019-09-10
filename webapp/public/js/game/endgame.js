import {client} from '/js/client.js';


client.ws.on('Game:end_game', ({winner})=>{
  gui.quit();

  gui.dialog("game-end", winner);
});
