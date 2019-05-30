import {areaSource} from '/js/ol/layers/areas.js';
import {arrowSource} from '/js/ol/layers/arrows.js';
import {unitSource} from '/js/ol/layers/units.js';
import {addUnit} from '/js/ol/units.js';
import {addArea} from '/js/ol/areas.js';
import {view} from '/js/ol/map.js';
import {getUnitComposition, getUnits, UNITS} from '/js/game/lib.js';
import {match} from '/js/game/store.js';


export function init_game(ctx) {
  match.me = ctx.iso;

  if (match.me) {
    //let country = countrySource.getFeatureById(match.me);
    gui.$refs.frame.iso = match.me;
  }
}

export function init_features(ctx) {
  const format = new ol.format.GeoJSON();
  const format2 = {'type': 'json'};

  // add areas:
  for (let area of ctx.areas) {
    addArea(area, format);
  }

  // Set up units
  for (let unit of ctx.units) {
    addUnit(unit, format2);
  }
};


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
