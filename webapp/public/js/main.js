import {map, view} from '/js/ol/map.js';
import {init_game, init_features} from '/js/ol/gfx.js';

import {load, onload} from '/js/game/loader.js';
import {client} from '/js/game/client.js';
import {rules,countries,units, match} from '/js/game/store.js';

import {AreasController} from '/js/game/controllers/areas.js';
import {UnitsController} from '/js/game/controllers/units.js';
import {GameController} from '/js/game/controllers/game.js';

import {init_test} from '/js/test.js';


export function init_app(debug, ws_address, user, token) {
  view.setCenter([1475042.8063459413, 6077055.881901362]);
  view.setZoom(6);

  client.controllers = {};

  client.controllers.Areas = new AreasController(client);
  client.controllers.Units = new UnitsController(client);
  client.controllers.Game = new GameController(client);

  match.wid = user.wid;
  match.me = user.iso;
  match.pid = user.uid;

  if (debug) {
    window.store = {
      units: units,
      countries: countries,
    };
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
      this.ctx.world = resp.world;

      this.loaded();
   });
  });

  onload((ctx) => {
    console.info("Game loaded");

    init_game(ctx);
    init_features(ctx);
    init_test();
  });
}