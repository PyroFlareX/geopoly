import {onload} from '/js/game/loader.js';
import {img_dim, sprites} from '/js/ol/sprites.js';
import {dirToIndex} from '/js/ol/units.js';

export const unitSource = new ol.source.Vector();

export const unitLayer = new ol.layer.Vector({
  source: unitSource,

  style: (feature, res) => {
    let dir = feature.get('dir');
    let frame = feature.get('frame');
    let i = feature.get('skin');

    let styles = [];

    if (!sprites[i])
      return;

    styles.push(new ol.style.Style({
      image: new ol.style.Icon(({
        img: sprites[i][dir][frame],
        imgSize: [img_dim.w, img_dim.h],
        scale: unit_scale
      }))
    }));

    return styles;
  }
});

const unit_scale = 1.3;
const sprite_speed = 10;
const v = 0.01; // m/s
const dt_per_area = 750;

unitLayer.update = (elapsedTime) => {
  let now = (new Date()).getTime();
  let animation_index = Math.round(sprite_speed * elapsedTime / 1000) % 6;

  for (let unit of unitSource.getFeatures()) {
    let geom = unit.getGeometry();
    let c1 = unit.get('move');
    let c0 = unit.get('move_0');

    if (!c1)
      continue;

    // animate
    unit.set('frame', animation_index);

    // calculate move position
    let dist = [c1[0] - c0[0], c1[1] - c0[1]];

    let dt = now - unit.get('move_t');
    // let S = Math.sqrt(dist[0]*dist[0] + dist[1]*dist[1]);

    // todo: T per area move (not path)
    let T = dt_per_area;
    // let T = S/v;
    let tp = dt/T;

    if (tp >= 1.0) {
      geom.setCoordinates(unit.get('move'));

      unit.set('move_t', null);
      unit.set('move', null);
      unit.set('move_0', null);
    } else {
      // partial move
      geom.setCoordinates([dist[0]*tp + c0[0], dist[1]*tp + c0[1]]);
    }
  }
}

unitLayer.keypress = (c1) => {
  if (key == 'W') {
    // North
  } else if (key == 'S') {
    // South
  } else if (key == 'D') {
    // East
  } else if (key == 'A') {
    // West
  }

};

onload(()=>{
  unitSource.changed();
});
