import {map, view} from '/js/ol/map.js';

import {setArea, generateBorders} from '/js/ol/gfx.js';
import {centroid, gps2merc, ringCoords} from '/js/ol/lib.js';
import {rules, turn} from '/js/game/store.js';
import {areaSource} from '/js/ol/layers/areas.js';

view.setCenter([1606523.03, 6222585.53]);
view.setZoom(6);

// more debug variables
window.layers = map.getLayers();
window.areas = window.layers.item(1).getSource();

// set up some match
let areas = [
  {
    id: 'AT1',
    iso: 'AT',

    inf_light: 100,
    inf_home: 7,
    inf_gren: 0,
    inf_skirmish: 0,
    cav_lancer: 0,
    cav_hussar: 0,
    cav_dragoon: 0,
    cav_heavy: 0,
    art_light: 0,
    art_heavy: 0,
    art_mortar: 0,
  },
  {
    id: 'AT2',
    iso: 'AT',

    inf_light: 0,
    inf_home: 250,
    inf_gren: 5,
    inf_skirmish: 0,
    cav_lancer: 0,
    cav_hussar: 20,
    cav_dragoon: 0,
    cav_heavy: 0,
    art_light: 0,
    art_heavy: 12,
    art_mortar: 0,
  },
  {
    id: 'HU2',
    iso: 'TR',

    inf_light: 0,
    inf_home: 0,
    inf_gren: 0,
    inf_skirmish: 0,
    cav_lancer: 0,
    cav_hussar: 0,
    cav_dragoon: 0,
    cav_heavy: 20,
    art_light: 0,
    art_heavy: 0,
    art_mortar: 0,
  },
  {
    id: 'HU1',
    iso: 'TR',

    inf_light: 0,
    inf_home: 0,
    inf_gren: 0,
    inf_skirmish: 0,
    cav_lancer: 0,
    cav_hussar: 0,
    cav_dragoon: 10,
    cav_heavy: 0,
    art_light: 0,
    art_heavy: 0,
    art_mortar: 0,
  },
  {
    id: 'FRF',
    iso: 'FR',

    inf_light: 0,
    inf_home: 0,
    inf_gren: 0,
    inf_skirmish: 0,
    cav_lancer: 0,
    cav_hussar: 10,
    cav_dragoon: 0,
    cav_heavy: 0,
    art_light: 0,
    art_heavy: 0,
    art_mortar: 0,
  }
];

export function init_test() {
  for (let area of areas) {
    setArea(area);
  }

  for (let feature of areaSource.getFeatures()) {
    // set centroid
    if (!feature.get('cen')) {
      let geom = feature.getGeometry();

      feature.set('cen', centroid(ringCoords(geom)));
    }

    // safe check: fix wgs84 to mercator
    let cen = feature.get('cen');
    if (cen[0] <= 180 && cen[1] <= 180)
      feature.set('cen', gps2merc(cen));

    // add id to properties
    feature.set('id', feature.getId());
  }


  generateBorders();


  turn.me = 'AT';
  turn.current = 'AT';
  turn.players = ['AT', 'RU', 'FR', 'UK'];

  // TEST:
  //gui.infobar('move', source.getFeatureById(2), source.getFeatureById(1));

}