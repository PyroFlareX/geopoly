import {areaSource} from '/js/ol/layers/areas.js';
import {unitSource} from '/js/ol/layers/units.js';
import {arrowSource} from '/js/ol/layers/arrows.js';

const move = {
  selected: null,
  units: null
};


export function onSelectUnits(feature) {
  // called when area feature is clicked!

  if (!move.selected) {
    // only select my area
    if (match.me != feature.get('iso')) {
      return;
    }

    if (len(feature.get('units')) == 0) {
      onCancelSelection();
      return;
    }

    let units = feature.get('units');

    if (len(units) > 0) {
      feature.set('selected', true);
      
      initHoverArrow(feature);
      move.selected = feature;
      move.units = units;

      gui.frame.units = units;
      //gui.infobar('move', from, to);
    }
  } else {
    let units = move.selected.get('units');
    let toUnits = feature.get('units');

    // check if we can move
    const N = len(toUnits) + len(units);
    const is_castle = feature.get('castle');

    if ((N > 18 && is_castle) || N > 9) {
      console.error("can't move there");
      return;
    }

    // todo: later check if path exists & find path
    //if (move.selected.get('conn') && !move.selected.get('conn').includes(feature.getId()))
    //  return;

    // move to 
    let cen = feature.get('cen');
    let now = (new Date()).getTime();

    for (let unit of units) {
      toUnits.push(unit);

      let c0 = unit.getGeometry().getCoordinates();

      //let dist = [c1[0] - c0[0], c1[1] - c0[1]];
      //let S = Math.sqrt(dist[0]*dist[0] + dist[1]*dist[1]);
      let c1 = posToCoord(cen, unit.get('pos'));

      unit.set('dir', dirToIndex(c0, c1));
      unit.set('move', c1);
      unit.set('move_0', c0);
      unit.set('move_t', now);
    }

    // todo: find path there & call controller right away
    
    move.selected.set('units', []);
    onCancelSelection();
    gui.frame.units = toUnits;
  }
}

export function onHoverUnits(feature) {
  if (move.selected) {

    // check if we can move there
    if (move.selected.get('conn')) {
      if (!move.selected.get('conn').includes(feature.getId())) {
        hideHoverArrow();

        return;
      }
    }

    if (feature.getId() != move.selected.getId()) {
      // todo: check if two areas are connected!

      // draw arrow from selected to this feature
      showHoverArrow(feature);
    }
  }

}

export function onCancelSelection() {
  if (move.selected) {
    move.selected = null;
    move.units = null;

    gui.frame.units = null;

    hideHoverArrow();

    return true;
  }

  return false;
}


export function addUnit(unit) {
  let feature = areaSource.getFeatureById(unit.aid);
  let units = feature.get('units');

  if (len(units) >= 9) {
    console.error("Can't add more units to area");
    return;
  }

  let unitFeature = new ol.Feature(Object.assign(unit, {
    geometry: new ol.geom.Point(posToCoord(feature.get('cen'), len(units))),

    frame: 0,
    dir: 4,
    pos: len(units),
    move: null,
  }));

  unitSource.addFeature(unitFeature);
  units.push(unitFeature);
}

export function dirToIndex(c0, c1) {
  let angle = Math.RAD_PER_DEG * Math.atan2(c1[1] - c0[1], c1[0] - c0[0]);
  let i;

  if (67.5 <= angle && angle <= 112.5) i = 0;
  else if (22.5 <= angle && angle <= 67.5) i = 1;
  else if (-22.5 <= angle && angle <= 22.5) i = 2;
  else if (-67.5 <= angle && angle <= -22.5) i = 3;
  else if (-112.5 <= angle && angle <= -67.5) i = 4;

  else if (-157.5 <= angle && angle <= -112.5) i = 7;
  else if (112.5 <= angle && angle <= 157.5) i = 5;
  else i = 6;

  return i;
}

const D = 40000;

export function posToCoord(refcoord, pos) {
  if (pos >= 9)
    pos = pos % 9;

  const Dx = D/2, Dy = D/2;

  const [x,y] = refcoord;

  switch(pos) {
    case 0: return refcoord; break;

    // sides
    case 1: return [x-Dx, y+Dy]; break;
    case 2: return [x+Dx, y-Dy]; break;
    case 3: return [x+Dx, y+Dy]; break;
    case 4: return [x-Dx, y-Dy]; break;
    
    // edges
    case 5: return [x+0, y-D]; break;
    case 6: return [x+0, y+D]; break;
    case 7: return [x-D, y+0]; break;
    case 8: return [x+D, y+0]; break;
  }

}


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
  hoverArrow.set('units', len(from.get('units')));

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
