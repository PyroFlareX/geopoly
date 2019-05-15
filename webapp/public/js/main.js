import {map, view} from '/js/ol/map.js';
import {init_game, init_features} from '/js/ol/gfx.js';

import {load, onload} from '/js/game/loader.js';
import {client} from '/js/game/client.js';
import {rules, match} from '/js/game/store.js';

import {AreasGroup} from '/js/game/groups/areas.js';
import {GameGroup} from '/js/game/groups/game.js';
import {MatchesGroup} from '/js/game/groups/matches.js';

import {init_test} from '/js/test.js';


export function init_app(debug, ws_address, uid, token) {
  view.setCenter([1475042.8063459413, 6077055.881901362]);
  view.setZoom(6);

  client.groups.Areas = new AreasGroup(client);
  client.groups.Game = new GameGroup(client);
  client.groups.Matches = new MatchesGroup(client);

  onload((ctx) => {
    console.info("Game loaded");
    init_game(ctx);
    init_test();
  });

  if (debug) {
    window.rules = rules;
    window.match = match;
    window.map = map;
    window.client = client;

    window.layers = map.getLayers();
    window.areas = window.layers.item(1).getSource();
  }

  load(function() {
    fetch('/client/load').then((resp)=>{
      return resp.json();
    }).then((resp)=>{
      this.ctx.iso = resp.iso;

      init_features(resp);

      this.loaded();
    });
  });
}
