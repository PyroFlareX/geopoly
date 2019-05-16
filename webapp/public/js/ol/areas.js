import {jumpTo} from '/js/ol/gfx.js';
import {areaSource} from '/js/ol/layers/areas.js';
import {match} from '/js/game/store.js';
import {centroid,multipolyCoords} from '/js/ol/lib.js';

/* jumpTo features  */
let jump_i = 0;
export function openRandom() {
  let areas = [];

  for (let feature of areaSource.getFeatures()) {
    if (feature.get('iso') == match.me && feature.get('castle') > 0)
      areas.push(feature);
  }

  if (++jump_i >= areas.length)
    jump_i = 0;

  let feature = areas[jump_i];
  
  gui.infobar('area', feature);

  return jumpTo(feature, true);
}


export function addArea(area, format) {
  let feature = format.readFeature(area);

  if (!feature.get('units')) feature.set('units', []);
  if (!feature.get('virgin')) feature.set('virgin', true);
  if (!feature.get('castle')) feature.set('castle', 0);

  if (!feature.get('cen')) {
    let coords = multipolyCoords(feature.getGeometry());
    let cen = centroid(coords[0][0]);

    feature.set('cen', cen);
  }

  areaSource.addFeature(feature);
}