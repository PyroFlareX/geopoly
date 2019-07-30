import {arrowSource} from '/engine/layers/arrows.js';


/************************\
 *       ARROWS         *
\************************/
const hoverArrow = new ol.Feature({
  rotation: 0,
  hide: true,
  locked: false,
  geometry: new ol.geom.LineString([[0,0], [0,0]])
})
arrowSource.addFeature(hoverArrow);

function initHoverArrow(from) {
  hoverArrow.set('locked', false);
  hoverArrow.set('hide', true);

  let geom = hoverArrow.getGeometry();

  let coords = geom.getCoordinates();
  let p = from.get('cen');
  hoverArrow.set('iso', from.get('iso'));
  hoverArrow.set('units', len(from.get('units').filter(unit => unit.get('role') == 'team')));

  geom.setCoordinates([p, p]);
}

function showHoverArrow(to) {
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
