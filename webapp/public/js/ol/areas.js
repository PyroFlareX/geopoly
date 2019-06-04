import {jumpTo} from '/js/ol/gfx.js';
import {areaSource} from '/js/ol/layers/areas.js';
import {match} from '/js/game/store.js';
import {centroid,multipolyCoords} from '/js/ol/lib.js';
import {conn} from '/js/game/store.js';


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
  if (areaSource.getFeatureById(area.id))
    return;

  console.error("!!! setup area fail", area)

  // let feature = format.readFeature(area);
  // setupFeature(feature);
  // areaSource.addFeature(feature);
}

export function setupFeature(feature) {
  if (!feature.get('units'))
    feature.set('units', []);
  if (!feature.get('virgin'))
    feature.set('virgin', true);
  if (!feature.get('castle'))
    feature.set('castle', 0);

  if (!feature.get('cen')) {
    let coords = multipolyCoords(feature.getGeometry());
    let cen = centroid(coords[0][0]);

    feature.set('cen', cen);
  }
}

let hovered = null;
let selected = null;

export function revealCastle(castle, keep) {
  const aid = castle.getId();
  const area = areaSource.getFeatureById(aid);

  if (!area) {
    console.error("Area is not loaded:", aid);
    return;
  }

  if (!keep) {
    if (hovered) {
      // hide area & its neighbors
      set_in_radius(hovered, 'visible', false);
      hovered = null;
    }

    // show area & its neighbors
    set_in_radius(area, 'visible', true);
    hovered = area;
  } else {
    if (selected) {
      selected.set('visible', false);
    }

    area.set('visible', true);
    selected = area;
  }
}

export function hideCastle(keep) {
  if (!keep) {
    if (hovered) {
      // hide area & its neighbors
      set_in_radius(hovered, 'visible', false);
      hovered = null;
    }
  } else if(selected) {
    selected.set('visible', false);
    selected = null;    
  }
}

export function set_in_radius(feature, key, value) {
  feature.set(key, value);

  for (let narea_id of conn[feature.getId()]) {
    let narea = areaSource.getFeatureById(narea_id);

    if (narea)
      narea.set(key, value);
  }
}