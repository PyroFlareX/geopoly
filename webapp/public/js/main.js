import {map, view} from '/engine/map.js';
import {load, onload} from '/engine/loader.js';

import {watercolorLayer} from '/engine/layers/watercolor.js';
//import {borderLayer} from '/engine/layers/borders.js';
import {arrowLayer} from '/engine/layers/arrows.js';

import {areaLayer} from '/js/layers/areas.js';
import {world} from '/js/store.js';

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


export function init_app(debug, ws_address, user, token) {
  view.setCenter([1475042.8063459413, 6077055.881901362]);
  view.setZoom(6);


  if (user && user.wid) {
    world.wid = user.wid;
    world.me = user.iso;
    world.pid = user.uid;
  }

  if (debug) {
    // window.store = {
    //   countries: countries,
    // };
    window.world = world;
    window.map = map;
    //window.client = client;

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

    // init_game(ctx);
    // init_features(ctx);
    // init_test();
  });

}


export function init_features(ctx) {
  const format = new ol.format.GeoJSON();
  const format2 = {'type': 'json'};

//  for (let feature of areaSource.getFeatures()) {
//    setupFeature(feature);
//  }

//  // add areas:
//  if (ctx.areas)
//  for (let area of ctx.areas) {
//    addArea(area, format);
//  }
//
//  // Set up units
//  if (ctx.units)
//  for (let unit of ctx.units) {
//    addUnit(unit, format2);
//  }
};