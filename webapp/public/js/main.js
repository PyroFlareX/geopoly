import {map, view} from '/engine/map.js';
import {load, onload} from '/engine/loader.js';
import {init_flags} from '/engine/flags.js';
import {gui} from '/engine/gui.js';

import {setup_feature} from '/engine/modules/geomap/conn.js';
import {load_world, set_user} from '/engine/modules/worlds/world.js';
import {init_borders, add_border_layer} from '/engine/modules/borders/borders.js';

import {watercolorLayer} from '/engine/layers/watercolor.js';
import {arrowLayer} from '/engine/layers/arrows.js';
import {areaLayer, areaSource} from '/js/layers/areas.js';

import {client} from '/js/client.js';
import {init_chat} from '/js/chat.js';


map.getLayers().extend([
  //osmLayer,
  watercolorLayer,
  //outlineLayer,

  areaLayer,
  
  add_border_layer('border-stroke', {
   width: 4
  }),
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

  view.setCenter([parseFloat(conf.client.center[0]), parseFloat(conf.client.center[1])]);
  view.setZoom(parseInt(conf.client.zoom));
  
  if (conf.client.debug) {
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

    // geoconn setup
    setup_feature(feature);
  }
  
  if (ctx.conf.borders.enabled) {
    ctx.conf.borders.source = areaSource;
    init_borders(ctx.conf.borders);
  }

  if (ctx.conf.chat.enabled) {
    // init WS global chat
    init_chat(gui.$refs['global-chat'], ctx.conf.chat);
  } else {
    // hide chat
    gui.$refs['global-chat'].show = false;
  }

  console.log("Game loaded.")
});
