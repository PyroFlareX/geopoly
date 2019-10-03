// Geogine
import {map, view, init_map} from '/engine/map.js';
import {load, onload, toload} from '/engine/loader.js';
import {init_flags} from '/engine/flags.js';

// Geogine modules
import {setup_features} from '/engine/modules/geomap/setup.js';
import {load_world, set_user} from '/engine/modules/worlds/world.js';
import {init_building} from '/engine/modules/building/building.js';
import {init_borders} from '/engine/modules/borders/borders.js';

// Layers
import {watercolorLayer} from '/engine/layers/watercolor.js';
import {arrowLayer} from '/engine/layers/arrows.js';
import {areaLayer, areaSource} from '/client/layers/areas.js';
import {countryLayer} from '/client/layers/countries.js';

// Game files
import {client} from '/client/websocket.js';
import {gui} from '/client/gui/load.js';
import {maps} from '/client/game/maps.js';
import {init_chat} from '/client/game/chat.js';

// @TODO: weird files, shouldn't really be loaded here
// we load them here, because nothing else makes a reference to them, but they do push events to websocket
import {} from "/client/game/money.js";
import {reset_game_entities} from '/client/game/economy.js'


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

// key
// @todo: add from settings + other keys too!
// @todo: smartcasts + settings
init_map({
  global_keypress: new Set([' ', 'ESCAPE', 'TAB']),

});
const world_map = maps[window.world_map];

// todo: set up colors?

export default function init_app(conf, user, token, world) {
  init_flags(conf.flags);

  // Init map view
  view.setCenter(world_map.center);
  view.setZoom(world_map.zoom[1]);
  view.setMinZoom(world_map.zoom[0]);
  view.setMaxZoom(world_map.zoom[2]);

  // Global variables for debug
  if (conf.client.debug) {
    window.map = map;
    window.layers = map.getLayers();
    window.areas = window.layers.item(1).getSource();
  }

  // Client and websocket
  client.init_game_client(conf.client, user);

  set_user(user);
  load_world(world, function(resp){
    // save info coming from WorldController
    this.ctx.conf = conf;
    this.ctx.debug = conf.client.debug;
    this.ctx.areas = resp.areas;
  });
}

// Load game:
toload("world", "map");
onload(["world", "map"], (ctx) => {
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

  // set area zoom separator
  const SR = maps[window.world_map].separate_resolution;
  areaLayer.setMaxResolution(SR);
  countryLayer.setMinResolution(SR);


  // geoconn setup
  setup_features(areaSource);
  
  if (ctx.conf.borders.enabled) {
    ctx.conf.borders.source = areaSource;
    init_borders(ctx.conf.borders);
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

  // initial reset of entities
  reset_game_entities(true);

  init_test();

  console.info("Game loaded.")
});
