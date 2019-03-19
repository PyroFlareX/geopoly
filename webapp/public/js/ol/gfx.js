import {areaSource} from '/js/ol/layers/areas.js';
import {arrowSource} from '/js/ol/layers/arrows.js';
import {centroid, ringCoords} from '/js/ol/lib.js';
import {map} from '/js/ol/map.js';

/**
 * GFX - graphics callbacks
 *
 *
 *
 **/

export function setArea(area) {
  let feature = areaSource.getFeatureById(area.id);

  feature.setProperties(area);

  // set centroid
  if (!feature.get('cen')) {
    let coords = feature.getGeometry().getCoordinates();

    feature.set('cen', centroid(ringCoords(coords)));
  }

  //updateUnitFeature(feature);
}


const hoverArrow = new ol.Feature({
  rotation: 0,
  hide: true,
  locked: false,
  geometry: new ol.geom.LineString([[0,0], [0,0]])
})
arrowSource.addFeature(hoverArrow);

export function initHoverArrow(from) {
  hoverArrow.set('locked', false);
  hoverArrow.set('hide', true);

  let geom = hoverArrow.getGeometry();

  let coords = geom.getCoordinates();
  let p = from.get('cen');

  geom.setCoordinates([p, p]);
}

export function showHoverArrow(to) {
  if (hoverArrow.set('locked'))
    return;

  hoverArrow.set('hide', false);

  let geom = hoverArrow.getGeometry();
  let coords = geom.getCoordinates();

  coords[1] = to.get('cen');

  geom.setCoordinates(coords);
}

export function hideHoverArrow(from) {
  hoverArrow.set('hide', true);
}

export function showMoveDialog(from, to) {
  hoverArrow.set('locked', true);
  // todo: +draw arrow

  gui.infobar('move', from, to);
}