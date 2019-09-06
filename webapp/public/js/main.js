import {map, view} from '/engine/map.js';
import {load, onload} from '/engine/loader.js';
import {init_flags} from '/engine/flags.js';
import {gui} from '/engine/gui.js';

import {setup_features} from '/engine/modules/geomap/setup.js';
import {load_world, set_user} from '/engine/modules/worlds/world.js';
import {init_building} from '/engine/modules/building/building.js';

import {watercolorLayer} from '/engine/layers/watercolor.js';
import {arrowLayer} from '/engine/layers/arrows.js';
import {areaLayer, areaSource} from '/js/layers/areas.js';
import {init_countries, countryLayer} from '/js/layers/countries.js';

import {client} from '/js/client.js';

import {maps} from '/js/game/maps.js';
import {init_chat} from '/js/game/chat.js';
import {} from "/js/game/building.js";



map.getLayers().extend([
  //osmLayer,
  watercolorLayer,
  //outlineLayer,

  areaLayer,
  countryLayer,
  // add_border_layer('border-fill', {
    
  // }),
  // add_border_layer('border-instroke', {
    
  // }),

  arrowLayer,
  // eventLayer,
  // unitLayer,
]);


// todo: set up colors?

export function init_app(conf, user, token, world) {
  init_flags(conf.flags);

  view.setCenter(maps[window.world_map].center);
  view.setZoom(maps[window.world_map].zoom);
  
  if (conf.client.debug) {
    window.map = map;
    window.layers = map.getLayers();
    window.areas = window.layers.item(1).getSource();
  }

  client.init_game_client(conf.client, user);

  set_user(user);
  load_world(world, function(resp){
    // save info coming from WorldController
    this.ctx.conf = conf;
    this.ctx.debug = conf.client.debug;
    this.ctx.areas = resp.areas;
  });
}


onload((ctx) => {
  // add areas
  for (let area of ctx.areas) {
    let feature = areaSource.getFeatureById(area.id);

    if (!feature) {
      console.error("Missing feature:" + area.id);
      continue;
    }

    // add properties
    feature.setProperties(area);
  }

  // geoconn setup
  setup_features(areaSource);
  
  if (ctx.conf.borders.enabled) {
    ctx.conf.borders.source = areaSource;
    init_countries(ctx.conf.borders);
  }

  if (ctx.conf.chat.enabled) {
    // init WS global chat
    init_chat(gui.$refs['global-chat'], ctx.conf.chat);
  } else {
    // hide chat
    if (gui.$refs['global-chat'])
      gui.$refs['global-chat'].show = false;
  }

  init_building(ctx.conf.building);

  console.log("Game loaded.")
});
