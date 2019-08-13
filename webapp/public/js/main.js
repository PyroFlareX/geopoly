import {map, view} from '/engine/map.js';
import {load, onload} from '/engine/loader.js';
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


export function init_app(debug, ws_address, user, token, world) {
  view.setCenter([1475042.8063459413, 6077055.881901362]);
  view.setZoom(6);
  
  client.ws.connect(ws_address, ()=>{

    // init WS auth
    client.ws.request("Users:guest", {
      wid: user.wid,
      uid: user.uid,
      iso: user.iso,
      username: user.username,
    }, ()=>{
      //...
    });
  });

  if (debug) {
    window.client = client;

    window.layers = map.getLayers();
    window.areas = window.layers.item(1).getSource();
  }

  set_user(user);
  load_world(world, function(resp){
    // save info coming from WorldController
    this.ctx.debug = debug;
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
  
  init_borders({
    source: areaSource,
  });

  // init WS global chat
  init_chat(gui.$refs['global-chat']);

  console.log("Game loaded.")
});
