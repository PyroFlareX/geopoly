import {areaSource} from '/js/layers/areas.js';
import {world} from '/js/store.js';


export function jumpTo(coord, animate) {
  if (!Array.isArray(coord)) {
    if (!(coord instanceof ol.Feature))
      var coord = areaSource.getFeatureById(feature);

    var coord = coord.get('cen');

    //if (!coord)
    // todo: get centroid
  }


  if (animate)
    view.animate({
      center: coord,
      duration: 920,
      easing: ol.easing.inAndOut
    });
  else
    view.animate({
      center: coord,
      duration: 100,
      easing: ol.easing.inAndOut
    });  
}

/* jumpTo features  */
let jump_i = 0;
export function openRandom() {
  let areas = [];

  for (let feature of areaSource.getFeatures()) {
    if (feature.get('iso') == world.me && feature.get('castle') > 0)
      areas.push(feature);
  }

  if (++jump_i >= areas.length)
    jump_i = 0;

  let feature = areas[jump_i];
  
  gui.infobar('area', feature);

  return jumpTo(feature, true);
}
