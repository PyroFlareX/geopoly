
import {watercolorLayer} from '/js/ol/base/watercolor.js';
import {outlineLayer} from '/js/ol/base/outline.js';
//import {osmLayer} from '/js/ol/base/osm.js';

import {areaLayer} from '/js/ol/layers/areas.js';
import {borderLayer} from '/js/ol/layers/borders.js';
//import {countryLayer} from '/js/ol/layers/countries.js';
import {unitLayer} from '/js/ol/layers/units.js';
//import {eventLayer} from '/js/ol/layers/events.js';
import {arrowLayer} from '/js/ol/layers/arrows.js';

export const view = new ol.View({
  center: [0, 0],
  // minZoom: 3,
  // maxZoom: 6,
  zoom: 2,
});

export const map = new ol.Map({
  layers: [
    //osmLayer,
    watercolorLayer,
    outlineLayer,

    //countryLayer,
    areaLayer,
    borderLayer,

    arrowLayer,
    // eventLayer,
    unitLayer,
  ],
  target: 'app-map',
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

  map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
    if (layer.hover)
      layer.hover(feature);
  });
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

/**
 * Event handlers for keypress
 **/
export let keys = {
  // Config:
  smartcast_enabled: true,

  keypress: new Set([
    // 'Q', 'W', 'E', 'R',
    // 'A', 'S', 'D', 'F'
    ' ', 'ESCAPE'
  ]),
  smartcastable: new Set([
    'Q',
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

    if (key == 'ESCAPE') {
      // special case, escape is not smartcast, but it always cancels selection

      let prevent = areaLayer.keypress(null, key);

      if (!prevent) {
        // close infobars
        gui.infobar('close');
        gui.dialog('close');
      }

    } else {
      // global keypress happened
      console.log("Keypress", key);
    }
  }
};

document.onkeyup = function (e) {
  keys.key_pressed = null;

  let key = e.key.toUpperCase();

  if (keys.smartcast_enabled) {
    keys.smartcast_happened = false;
  }
};