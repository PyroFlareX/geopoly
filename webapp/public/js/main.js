import {rules, turn} from '/js/game/store.js';
import {onload} from '/js/game/loader.js';
import {client} from '/js/game/client_offline.js';
import {map} from '/js/ol/map.js';
import {gui} from '/js/vue/gui.js';
import {init_game} from '/js/ol/gfx.js';

import {init_test} from '/js/test.js';



export function init_app(debug) {
  window.gui = gui;

  if (debug) {
    // debug: set global variables

    window.rules = rules;
    window.turn = turn;
    window.map = map;
    window.client = client;

    onload(() => {
      console.info("Game loaded");
      
      init_test();
      init_game();
    });
  }
}
