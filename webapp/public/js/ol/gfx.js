import {areaSource} from '/js/ol/layers/areas.js';
import {arrowSource} from '/js/ol/layers/arrows.js';
import {unitSource} from '/js/ol/layers/units.js';
import {addUnit} from '/js/ol/units.js';
import {addArea} from '/js/ol/areas.js';
import {view} from '/js/ol/map.js';
import {getUnitComposition, getUnits, UNITS} from '/js/game/lib.js';
import {match} from '/js/game/store.js';

/**
 * GFX - general graphics callbacks
 *
 *
 *
 **/

export function setArea(area) {
  /**
   * Sets properties of Area Feature from area object coming from the server
   * this method is used for loading areas
   **/

  // Set area properties
  let feature = areaSource.getFeatureById(area.id);
  if (!feature) {
    console.error("setArea -- Area feature not found:", area.id);
    return;
  }

  feature.setProperties(area);

  // set centroid
  // if (!feature.get('cen')) {
  //   let geom = feature.getGeometry();

  //   feature.set('cen', centroid(ringCoords(geom)));
  // }

  // Check if there's a unit feature needed
  //updateUnitFeature(feature);
}

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
