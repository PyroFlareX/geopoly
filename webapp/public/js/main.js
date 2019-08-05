import {map, view} from '/engine/map.js';
import {load, onload} from '/engine/loader.js';
import {setup_feature} from '/engine/modules/geomap/conn.js';
import {load_world, set_user} from '/engine/modules/worlds/world.js';

import {watercolorLayer} from '/engine/layers/watercolor.js';
import {arrowLayer} from '/engine/layers/arrows.js';
//import {borderLayer} from '/engine/layers/borders.js';

import {client} from '/js/client.js';
import {areaLayer, areaSource} from '/js/layers/areas.js';


map.getLayers().extend([
  //osmLayer,
  watercolorLayer,
  //outlineLayer,

  areaLayer,
  //borderLayer,

  arrowLayer,
  // eventLayer,
  // unitLayer,
]);


// todo: set up colors?


export function init_app(debug, ws_address, user, token, world) {
  view.setCenter([1475042.8063459413, 6077055.881901362]);
  view.setZoom(6);
  
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

  console.log("Game loaded.")
});
