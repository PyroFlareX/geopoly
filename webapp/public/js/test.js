import {store} from '/js/game/store.js';
import {map, view} from '/js/ol/map.js';

import {setArea} from '/js/ol/gfx.js';
import {centroid, gps2merc} from '/js/ol/lib.js';


view.setCenter([1606523.03, 6222585.53]);
view.setZoom(6);

// more debug variables
window.layers = map.getLayers();
window.areas = window.layers.item(1).getSource();

// set up some match
let areas = [
  {
    id: 2,
    iso: 'UK',

    inf_light: 100,
    inf_home: 10,
    inf_gren: 5,
    inf_skirmish: 0,
    cav_lancer: 0,
    cav_hussar: 20,
    cav_dragoon: 0,
    cav_heavy: 0,
    art_light: 0,
    art_heavy: 12,
    art_mortar: 0,
  }
];

export function init_test() {
  for (let area of areas) {
    setArea(area);
  }

  for (let feature of layers.item(1).getSource().getFeatures()) {
    // safe check: fix wgs84 to mercator
    let cen = feature.get('cen');
    if (cen[0] <= 180 && cen[1] <= 180)
      feature.set('cen', gps2merc(cen));
  }
}