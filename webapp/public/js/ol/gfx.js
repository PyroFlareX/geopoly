import {areaSource} from '/js/ol/layers/areas.js';
import {arrowSource} from '/js/ol/layers/arrows.js';
import {unitSource} from '/js/ol/layers/units.js';
import {view} from '/js/ol/map.js';
import {getUnitComposition, getUnits, UNITS} from '/js/game/lib.js';
import {match} from '/js/game/store.js';

/**
 * GFX - graphics callbacks
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
    console.error("Area feature not found:", area.id);
    return;
  }

  feature.setProperties(area);

  // set centroid
  // if (!feature.get('cen')) {
  //   let geom = feature.getGeometry();

  //   feature.set('cen', centroid(ringCoords(geom)));
  // }

  // Check if there's a unit feature needed
  updateUnitFeature(feature);
}

export function init_game(ctx) {
  if (match.me) {
    //let country = countrySource.getFeatureById(match.me);
    gui.$refs.frame.iso = match.me;
  }

  // Set up areas
  for (let area of ctx.areas) {
    setArea(area);
  }
};

/************************\
 *        UNITS         *
\************************/
export function updateUnits(feature, patch, dir) {
  if (!dir) var dir = 1;

  if (!(feature instanceof ol.Feature))
    var feature = areaSource.getFeatureById(feature);

  for (let [u, num] of Object.items(patch)) {
    //console.log(u,num);
    feature.set(u, (feature.get(u)||0) + dir*num);
  }

  updateUnitFeature(feature);
}

export function clearUnits(feature) {
  if (!(feature instanceof ol.Feature))
    var feature = areaSource.getFeatureById(feature);

  for (let u of UNITS)
    feature.set(u, 0);

  updateUnitFeature(feature);
}

export function setUnits(feature, patch) {
  if (!(feature instanceof ol.Feature))
    var feature = areaSource.getFeatureById(feature);

  for (let u of UNITS) {
    feature.set(u, patch[u]);
  }

  updateUnitFeature(feature);
}

export function updateUnitFeature(feature) {
  // set unit feature
  let [mils, uclass, utype] = getUnitComposition(feature);
  let unitFeature = feature.get('unit');

  if (!unitFeature) {
    if (mils > 0) {
      // create new unit feature
      unitFeature = new ol.Feature({
        geometry: new ol.geom.Point(feature.get('cen')),
        area_id: feature.getId(),
        iso: feature.get('iso'),
        mils: mils,
        uclass: uclass,
        utype: utype
      });

      feature.set('unit', unitFeature);
      unitSource.addFeature(unitFeature);
    }
  }
  else {
    if (mils == 0) {
      // remove unit feature
      feature.unset('unit');
      unitSource.removeFeature(unitFeature);
    }
    else {
      // update unit feature
      unitFeature.set('area_id', feature.getId());
      unitFeature.set('iso', feature.get('iso'));

      unitFeature.set('mils', mils);
      unitFeature.set('uclass', uclass);
      unitFeature.set('utype', utype);
    }
  }
}



/************************\
 *     AREA MOVES       *
\************************/
export function moveUnits(fromId, toId, patch, move_left) {
  let from = areaSource.getFeatureById(fromId);
  let to = areaSource.getFeatureById(toId);

  from.set('selected', false);

  from.set('move_left', move_left);
  to.set('move_left', 0);

  updateUnits(from, patch, -1);
  updateUnits(to, patch, 1);
  areaSource.changed();

  hideHoverArrow();

  updateUnitFeature(from);
  updateUnitFeature(to);
}

export function reset_moves() {
  for (let feature of areaSource.getFeatures()) {

    let unitPop = getUnits(feature);
    feature.set('move_left', unitPop);
  }
}

export function conquer(areaId, iso) {
  let feature = areaSource.getFeatureById(areaId);

  if (feature.get('iso') != iso) {
    feature.set('iso', iso);

    if (getUnits(feature) > 0) {
      // reset area as well
      for (let u of UNITS) {
        feature.set(u, 0);
      }
    }
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

export function initHoverArrow(from) {
  hoverArrow.set('locked', false);
  hoverArrow.set('hide', true);

  let geom = hoverArrow.getGeometry();

  let coords = geom.getCoordinates();
  let p = from.get('cen');
  hoverArrow.set('iso', from.get('iso'));

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


/* jumpTo features  */
let jump_i = 0;
export function jumpToRandom(iso, animate) {
  let areas = [];

  for (let feature of areaSource.getFeatures()) {
    if (feature.get('iso') == iso)
      areas.push(feature);
  }

  if (++jump_i >= areas.length)
    jump_i = 0;

  let feature = areas[jump_i];
  //0let feature = random.choice(areas);

  return jumpTo(feature, animate);
}

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
