import {onload} from '/js/game/loader.js';
import {img_dim, sprites} from '/js/ol/sprites.js';
import {simulate_movement} from '/js/ol/units.js';
import {getFlag, img_dim as flag_dim} from '/js/game/colors.js';

export const unitSource = new ol.source.Vector();

export const unitLayer = new ol.layer.Vector({
  source: unitSource,

  style: (feature, res) => {
    let dir = feature.get('dir');
    let frame = feature.get('frame');
    let i = feature.get('skin');
    let pos = feature.get('pos');

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


    // if (pos == 0) {
    //   let iso = feature.get('iso');
    //   let img = getFlag(iso);

    //   if (img)
    //     styles.push(new ol.style.Style({
    //       image: new ol.style.Icon(({
    //         img: img,
    //         imgSize: [flag_dim.w, flag_dim.h],
    //         scale: 0.05
    //       })),
    //       //geometry: new ol.geom.Point(feature.get('cen'))
    //     }));
    // }

    return styles;
  }
});

const unit_scale = 1.3;
const sprite_speed = 10;

unitLayer.update = (elapsedTime) => {
  let now = (new Date()).getTime();
  let animation_index = Math.round(sprite_speed * elapsedTime / 1000) % 6;

  for (let unit of unitSource.getFeatures()) {
    if (!unit.get('move'))
      continue;

    // animate
    unit.set('frame', animation_index);

    simulate_movement(unit, now);
  }
}

onload(()=>{
  unitSource.changed();
});
