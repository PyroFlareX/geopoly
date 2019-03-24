import {areaSource} from '/js/ol/layers/areas.js';
import {arrowSource} from '/js/ol/layers/arrows.js';
import {unitSource} from '/js/ol/layers/units.js';
import {borderSource} from '/js/ol/layers/borders.js';
import {countrySource} from '/js/ol/layers/countries.js';
import {centroid,ringCoords,multipolyCoords,vv} from '/js/ol/lib.js';
import {map} from '/js/ol/map.js';
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

/************************\
 *       BORDERS        *
\************************/
export function generateBorders() {
  //borderSource.clear();

  var format = new ol.format.GeoJSON();
  let isoCoords = defaultdict(list);

  // go through all polygons in geometry and add them to iso
  for (let feature of areaSource.getFeatures()) {
    let iso = feature.get('iso');
    if (!iso || iso == 'XX')
      continue;

    let coords = multipolyCoords(feature.getGeometry());
    for (let coords0 of coords)
      isoCoords[iso].push(coords0);
  }

  // make unions of all polygons within the same iso
  for (let iso in isoCoords) {
    try {
      let polys = [];
      for (let coord of isoCoords[iso]) {
        polys.push(turf.polygon(coord));
      }
      var union = turf.union.apply(null, polys);
    } catch(e) {
      console.error("  Skipped poly", iso, e)
      continue;
      //return;
    }

    let feature = format.readFeature(union, {
      featureProjection: ol.proj.get('EPSG:3857'),
      dataProjection : 'EPSG:3857',
    });

    // Add geometry to feature
    let countryFeature = countrySource.getFeatureById(iso);
    if (!countryFeature)
      countryFeature = createCountryFeature(iso);

    countryFeature.setGeometry(feature.getGeometry());
  }

  countrySource.changed();
  //createCountryInnerBorders_OLD();
}

export function offsetGeometry (feature, size) {
  switch (feature.getGeometry().getType()) {
    case 'Polygon':
      var coords = feature.getGeometry().getCoordinates();
      var sign = feature.getGeometry().getLinearRing(0).getArea()<0 ? -1:1;
      coords[0] = ol.coordinate.offsetCoords(coords[0], sign*size);
      return new ol.geom.Polygon(coords);
    case 'LineString':
      var coords = feature.getGeometry().getCoordinates();
      coords = ol.coordinate.offsetCoords(coords, size);
      return new ol.geom.LineString(coords);
    default:
      return feature.getGeometry();
  }
}

function createCountryInnerBorders() {
  var T1 = (new Date()).getTime();
  borderSource.clear();

  let offset = 12;
  let _res = 611;

  for (var feature of countrySource.getFeatures()) {
    let borderFeature = createBorderFeature(feature.get('iso'), offset);

    borderFeature.setGeometry(offsetGeometry(feature, offset*_res));
  }

  var T2 = (new Date()).getTime();
  console.log('borders rendered', T2-T1, 'ms');
}

function createCountryInnerBorders_OLD() {
  var T1 = (new Date()).getTime();
  var SL = 20000;
  borderSource.clear();

  for (var feature of countrySource.getFeatures()) {
    var geom = feature.getGeometry();
    if (!geom)
      continue;
    var multipoly = multipolyCoords(geom);
    var isMultipoly = Boolean(geom.getPolygons);

    var imultipoly = [];
    var prevort = null;

    // iterate through all rings
    for (var poly of multipoly) {
      var outerring = poly[0];

      var cen = centroid(outerring);
      var iouterring = [];
      var L = outerring.length;
      if (L < 3)
        continue;

      // for each point in the ring:
      for (var i of range(L)) {
        // points i-1, i, i+1 (cyclic)
        var Pcurr = outerring[i];
        var Pprev = (i != 0) ? outerring[i-1] : outerring[L-2];
        var Pnext = (i != L-1) ? outerring[i+1] : outerring[1];

        var V0 = vv.dir(Pcurr, Pprev);
        var V1 = vv.dir(Pcurr, Pnext);

        var dir = vv.norm(vv.bisector(V0, V1));

        if (vv.len(dir) == 0) {
          var q = vv.norm(vv.dir(Pcurr, Pprev));
          dir = vv.perpL(q);
        }
        else if (!cross_sign(V0,V1))
          dir = [-dir[0], -dir[1]];

        var Pcent = [Pcurr[0]+SL*dir[0], Pcurr[1]+SL*dir[1]];
        var icoord = Pcent;

        iouterring.push(icoord);
      }

      var ipoly = [iouterring];
      imultipoly.push(ipoly);
    }

    if (isMultipoly)
      var igeom = new ol.geom.MultiPolygon(imultipoly);
    else
      var igeom = new ol.geom.Polygon(imultipoly[0]);

    let featureInner = createBorderFeature(feature.get('iso'));
    featureInner.setGeometry(igeom);
  }

  var T2 = (new Date()).getTime();
  console.log('borders rendered', T2-T1, 'ms');
};

function cross_sign(X, Y) {
  return X[0] * Y[1] > X[1] * Y[0];
}

function createBorderFeature(iso, offset) {
  let feature = new ol.Feature({
    iso: iso,
    offset: offset,
    // todo: other values?

    geometry: null,
  });
  feature.setId(iso);

  borderSource.addFeature(feature);

  return feature;
}

function createCountryFeature(iso) {
  let feature = new ol.Feature({
    iso: iso,

    // todo: other values?

    geometry: null,
  });
  feature.setId(iso);

  countrySource.addFeature(feature);

  return feature;
}
