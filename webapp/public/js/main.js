import {load_test, init_test} from '/js/test.js';
import {onload} from '/js/game/loader.js';
import {init_game} from '/js/ol/gfx.js';

import {client} from '/js/game/client.js';
import {gui} from '/js/vue/gui.js';

import {AreasGroup} from '/js/game/groups/areas.js';
import {MatchesGroup} from '/js/game/groups/matches.js';


export function init_app(debug, ws_address) {

  window.gui = gui;

  client.groups.Areas = new AreasGroup(client);
  client.groups.Matches = new MatchesGroup(client);


  if (debug) {
    load_test(ws_address);

    onload((ctx) => {
      console.info("Game loaded");

      init_test(ctx);
      init_game(ctx);
    });
  }
}
