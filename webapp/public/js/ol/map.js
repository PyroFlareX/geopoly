
import {watercolorLayer} from '/js/ol/base/watercolor.js';
import {outlineLayer} from '/js/ol/base/outline.js';
//import {osmLayer} from '/js/ol/base/osm.js';

import {areaLayer} from '/js/ol/layers/areas.js';
import {borderLayer} from '/js/ol/layers/borders.js';
import {unitLayer} from '/js/ol/layers/units.js';
//import {eventLayer} from '/js/ol/layers/events.js';
import {arrowLayer} from '/js/ol/layers/arrows.js';

ol.style.IconImageCache.shared.setSize(512);

export const view = new ol.View({
  center: [0, 0],
  minZoom: 5,
  maxZoom: 7,
  zoom: 6,
});

export const map = new ol.Map({
  layers: [
    //osmLayer,
    watercolorLayer,
    //outlineLayer,

    areaLayer,
    //borderLayer,

    arrowLayer,
    // eventLayer,
    unitLayer,
  ],
  target: 'app-map',
  //renderer: 'webgl',
  controls: ol.control.defaults({
    attribution: false,
    // attributionOptions: {
    //   collapsible: false,
    // }
  }),
  interactions: ol.interaction.defaults({
    doubleClickZoom :false,
    // dragAndDrop: false,
    // keyboardPan: false,
    // keyboardZoom: false,
    // mouseWheelZoom: false,
    // pointer: false,
    // select: false
  }),
  view: view
});

export const baselayers = [
  //osmLayer,
  watercolorLayer,
  outlineLayer
];


// Jump to feature
let jumper = {
  jump_i: 0,

}

map.on('pointermove', (event) => {
  /**
   * Event for mouse movement over features
   */
  if (keys.smartcast_enabled) {
    keys.mouse_pixel = event.pixel;
  }

  let found_feature = false;
  map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
    if (layer.hover) {
      found_feature = true;

      layer.hover(feature);
    }
  });

  if (!found_feature) {
    areaLayer.hover_out();
  }
});

map.on('click', (event) => {
  /**
   * Event for mouse click over feature
   */

  if (!keys.smartcast_enabled && keys.key_pressed && keys.smartcastable.has(keys.key_pressed)) {
    // smartcast is off, player clicked with keypress
    // player adds modifiers by clicking while holding key down

    map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
      if (layer.keypress) {
        layer.keypress(feature, keys.key_pressed);
      }
    });

  } else {
    // Regular click happened

    let has_feature = false;

    // default key modifier is CTRL / SHIFT / ALT
    let keyMod = event.originalEvent.ctrlKey ? 'CTRL' : (event.originalEvent.shiftKey ? 'SHIFT' : (event.originalEvent.altKey ? 'ALT' : null));

    map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
      if (layer.click) {
        layer.click(feature, keyMod);

        has_feature = true;
      }
    });

    if (!has_feature) {
      // global click happened
      console.log("Click on global");
    }
  }
});

let start_time = new Date().getTime();
let postcompose = function(event) {
  var vectorContext = event.vectorContext;
  var frameState = event.frameState;

  unitLayer.update(frameState.time - start_time);

  map.render();
};
map.on('postcompose', postcompose);

/**
 * Event handlers for keypress
 **/
export let keys = {
  // Config:
  smartcast_enabled: true,

  keypress: new Set([
    ' ', 'ESCAPE'
  ]),
  smartcastable: new Set([
    'Q', 'W', 'E', 'R',
    // 'A', 'S', 'D', 'F'
    // 'M', 'B'
  ]),

  // Internal:  
  smartcast_happened: false,
  key_pressed: null,
  mouse_pixel: null,
};

document.onkeydown = function (e) {
  let key = e.key.toUpperCase();

  if (keys.smartcast_enabled && keys.smartcastable.has(key)) {
    // smartcast happens once, prevent the event otherwise
    if (keys.smartcast_happened)
      return;
    keys.smartcast_happened = true;

    // smartcast was called
    if (keys.mouse_pixel != null) {

      map.forEachFeatureAtPixel(keys.mouse_pixel, (feature, layer) => {
        if (layer.keypress) {
          layer.keypress(feature, key);
        }
      });
    }
  } else if (!keys.smartcast_enabled) {
    // register key pressed for non-smartcast mouse event
    keys.key_pressed = key;
  }

  if (keys.keypress.has(key)) {
    areaLayer.keypress(null, key);
  }
};

document.onkeyup = function (e) {
  keys.key_pressed = null;

  let key = e.key.toUpperCase();

  if (keys.smartcast_enabled) {
    keys.smartcast_happened = false;
  }
};
