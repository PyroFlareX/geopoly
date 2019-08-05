import {load, onload} from '/engine/loader.js';
import {getColor, getMapBlend, getHighlight} from '/engine/colors.js';
import {openRandom} from '/engine/gfx/jumpto.js';
import {world, countries} from '/engine/modules/worlds/world.js';

/**
 * Area layer
 * 
 */
// todo: later: download as zip & unzip
export const areaSource = new ol.source.Vector({
  format: new ol.format.GeoJSON(),
  url: `/maps/${window.world_map}.geojson`,
});

export const areaLayer = new ol.layer.Vector({
  source: areaSource,
  maxResolution: 4000,
});
areaLayer.name = 'areas';

// let hovered = null;

// areaLayer.hover = (feature) => {
//   if (hovered) {
//     hovered.set('visible', false);
//   }

//   feature.set('visible', true);
//   hovered = feature;
//   $("#app-map").style.cursor = "url('/img/map/claim-cursor.png'), default";

//   //onHoverUnits(feature);
// };

// areaLayer.hover_out = () => {
//   if (hovered) {
//     hovered.set('visible', false);
//     hovered = null;
//   }

//   $("#app-map").style.cursor = "";
  
//   //hideHoverArrow();
// };

load(function() {
  var listenerKey = areaSource.on('change', (e) => {
    if (areaSource.getState() == 'ready' && len(areaSource.getFeatures()) > 0) {
      ol.Observable.unByKey(listenerKey);
      this.loaded();
    }
  });
});
