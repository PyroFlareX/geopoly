import {areaSource} from '/js/ol/layers/areas.js';
import {unitSource} from '/js/ol/layers/units.js';
import {arrowSource} from '/js/ol/layers/arrows.js';
import {find_path} from '/js/game/pathfinder.js';

const move = {
  selected: null,
  units: null
};


export function onSelectUnits(feature) {
  // called when area feature is clicked!

  if (!move.selected) {
    if (len(feature.get('units')) == 0) {
      onCancelSelection();
      return;
    }

    let units = feature.get('units');

    if (len(units) > 0) {
      // only select my units
      //if (match.me != units[0].get('iso')) {
      //  return;
      //}

      feature.set('selected', true);
      
      initHoverArrow(feature);
      move.selected = feature;
      move.units = units;

      gui.frame.units = units;
      //gui.infobar('move', from, to);
    } else {
      // select area / castle
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

    // check if path exists & find path
    let path = find_path(move.selected.getId(), feature.getId());
    let coord_path = [];

    for (let iso of path) {
      let feature = areaSource.getFeatureById(iso);
      coord_path.push(feature.get('cen'));
    }

    // move to next in path
    let next = coord_path.shift();
    let now = (new Date()).getTime();
    
    let unit_ids = [];

    for (let unit of units) {
      toUnits.push(unit);
      unit_ids.push(unit.getId());

      let c0 = unit.getGeometry().getCoordinates();
      let c1 = posToCoord(next, unit.get('pos'));
      //let dist = [c1[0] - c0[0], c1[1] - c0[1]];
      //let S = Math.sqrt(dist[0]*dist[0] + dist[1]*dist[1]);

      unit.set('dir', dirToIndex(c0, c1));
      unit.set('move', c1);
      unit.set('move_0', c0);
      unit.set('move_t', now);
      unit.set('path', coord_path.slice());
    }

    // todo: call controller right away
    //client.groups.Units.request_move(path, unit_ids);
    client.groups.Areas.request_vision(feature);
    

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

function dirToIndex(c0, c1) {
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

function posToCoord(refcoord, pos) {
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

const dt_per_area = 750;

export function simulate_movement(unit, now) {
  if (!now) var now = (new Date()).getTime();

  let geom = unit.getGeometry();
  let c1 = unit.get('move');
  let c0 = unit.get('move_0');

  // calculate move position
  let dist = [c1[0] - c0[0], c1[1] - c0[1]];

  let dt = now - unit.get('move_t');
  // let S = Math.sqrt(dist[0]*dist[0] + dist[1]*dist[1]);

  // todo: T per area move (not path)
  let T = dt_per_area;
  // let T = S/v;
  let tp = dt/T;

  if (tp >= 1.0) {
    let c2 = unit.get('move');
    geom.setCoordinates(c2);

    if (len(unit.get('path')) > 0) {
      let c3 = posToCoord(unit.get('path').shift(), unit.get('pos'));

      unit.set('dir', dirToIndex(c2, c3));
      unit.set('move', c3);
      unit.set('move_0', c2);
      unit.set('move_t', now);
    } else {
      unit.set('move_t', null);
      unit.set('move', null);
      unit.set('move_0', null);
      unit.set('path', null);
    }
  } else {
    // partial move
    geom.setCoordinates([dist[0]*tp + c0[0], dist[1]*tp + c0[1]]);
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
