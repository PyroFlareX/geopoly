import {store} from '/js/game/store.js';
import {map} from '/js/ol/map.js';


// debug: set global variables

export function init_app(debug) {



  //window.gui = gui;
  if (debug) {
    window.store = store;
    window.map = map;
    //window.client = client;
  }
}