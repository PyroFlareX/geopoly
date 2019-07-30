import {areaSource} from '/js/ol/layers/areas.js';
import {borderSource} from '/js/ol/layers/borders.js';
import {countrySource} from '/js/ol/layers/countries.js';
import {centroid,ringCoords,multipolyCoords,vv} from '/js/ol/lib.js';

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
