import {MAP_CENTER,MAP_ZOOM,FIELD_OWNER, FIELD_ID, FIELD_NAME} from '/js/config.js';

var baseLayer = new ol.layer.Tile({
  source: new ol.source.OSM()
});

const isocolors = {
  'UK': new Color([207, 20, 43]),
  'FR': new Color([3, 7, 147]),
  'RU': new Color([63, 120, 35]),
  'IT': new Color([30, 190, 75]),
  'SE': new Color([0, 40, 104]),
  'DK': new Color([230, 29, 24]),
  'AT': new Color([254, 205, 33]),
  'DE': new Color([60, 77, 75]),
  'ES': new Color([170, 110, 40]),
  'NL': new Color([253, 73, 29]),
  'BE': new Color([128, 78, 56]),
  'CH': new Color([232, 43, 54]),
  'PT': new Color([0, 81, 151]),
  'EL': new Color([116, 172, 223]),
  'RO': new Color([145, 30, 180]),
  'RS': new Color([128, 106, 43]),
  'BG': new Color([0, 161, 242]),
  'TR': new Color([194, 24, 40]),

  // 'EG': new Color([158, 11, 33]),
  // 'MA': new Color([243, 67, 38]),
  // 'IR': new Color([245, 130, 48]),
};

var areaLayer = new ol.layer.Vector({
  source: new ol.source.Vector(),
  style: function(feature) {
    var iso = feature.get(FIELD_OWNER);

    // else if (iso.length == 5) {
    //   var col = 'rgba(50,50,50,0.2)';
    // } else {
    // }
    if (selects[0] && selects[0].getId() == feature.getId())
      var col = 'rgba(270,50,50,0.2)';
    else if (selects[1] && selects[1].getId() == feature.getId())
      var col = 'rgba(150,50,50,0.2)';
    else if (isocolors[iso]) {
      var col = isocolors[iso].a(0.6).rgba();
    } else 
      var col = 'rgba(50,270,50,0.04)';

    let geom = feature.getGeometry();
    if (geom.getType() == 'MultiPolygon') {
      // let centroids = [];

      // for (let ring of geom.getCoordinates()) {
      //   centroids.push(centroid(ring[0]));
      // }

      // var point = centroid(centroids);
      var point = centroid(geom.getCoordinates()[0][0]);
    }
    else if (geom.getType() == 'Polygon')
      var point = centroid(geom.getCoordinates()[0]);

    let styles = [new ol.style.Style({
      fill: new ol.style.Fill({
        color: col
      }),
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 0.5
      }),
    }), new ol.style.Style({
      text: new ol.style.Text({
        text: feature.get(FIELD_NAME),
        fill: new ol.style.Fill({color: "white"}),
        stroke: new ol.style.Stroke({color: "black", width: 3}),
        font: '14px "Opera Lyrics"'
      }),
      geometry: new ol.geom.Point(point)
    })];

    return styles;
  }
});


var riverLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    //url: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_rivers_lake_centerlines.geojson',
    url: '/static/rivers.json',
    format: new ol.format.GeoJSON(),
  }),
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: '#CCFFFF'
    }),
    stroke: new ol.style.Stroke({
      color: '#CCFFFF',
      width: 2
    }),
  })
});

var map = new ol.Map({
  target: 'map',
  layers: [
    baseLayer,
    areaLayer,
    //riverLayer,
  ],
  view: new ol.View({
    center: MAP_CENTER,
    zoom: MAP_ZOOM,
    // minZoom: 3,
    // maxZoom: 8,
  })
});

window.map = map;

let selects = [null, null];
var contextmenu = new ContextMenu({
  width: 170,
  defaultItems: false,
  items: []
});
map.addControl(contextmenu);

contextmenu.on('open', function (evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel, ft => ft);
  
  contextmenu.clear();
  contextmenu.extend(contextmenuItems);
});


function merge(feature1, feature2) {
  let poly1 = to_poly(feature1);
  let poly2 = to_poly(feature2);

  var geojson = turf.union(poly1, poly2);

  let feature = feature1.clone();
  let geometry = (new ol.format.GeoJSON()).readGeometry(
    geojson.geometry,
    {
      dataProjection: ol.proj.get('EPSG:3857'),
      featureProjection: ol.proj.get('EPSG:3857')
    }
  );

  feature.setId(feature1.getId());
  feature.setGeometry(geometry);

  return feature;
}

function to_poly(feature) {
  var geom = feature.getGeometry();

  if (geom.getType() == 'MultiPolygon') {
    var poly = turf.multiPolygon(feature.getGeometry().getCoordinates());
  } else if (geom.getType() == 'Polygon') {
    var poly = turf.polygon(feature.getGeometry().getCoordinates());
  }

  poly.id = feature.getId();
  poly.properties = feature.getProperties();
  delete poly['properties']['geometry'];

  return poly;
}


function centroid(pts) {
  var first = pts[0], last = pts[pts.length-1];
  if (first[0] != last[0] || first[1] != last[1]) pts.push(first);
  var twicearea=0,
  x=0, y=0,
  nPts = pts.length,
  p1, p2, f;
  for ( var i=0, j=nPts-1 ; i<nPts ; j=i++ ) {
    p1 = pts[i]; p2 = pts[j];
    f = p1[0]*p2[1] - p2[0]*p1[1];
    twicearea += f;
    x += ( p1[0] + p2[0] ) * f;
    y += ( p1[1] + p2[1] ) * f;
  }
  f = twicearea * 3;
  return [x/f, y/f];
}

function to_feature(geojson) {
  return (new ol.format.GeoJSON()).readFeature(
    geojson,
    {featureProjection: ol.proj.get('EPSG:3857')}
  );
}

function download_file(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function download_all() {
  let source = areaLayer.getSource();
  let cont = {
    "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:EPSG::3857"}},
    "type": "FeatureCollection", 
    "features": []
  };

  for(let feature of source.getFeatures()) {
    cont.features.push(to_poly(feature));
  }

  download_file('areas.geojson', JSON.stringify(cont));
}


function create_ownership_file() {
  let ownerships = {};

  for (let feature of map.getLayers().item(1).getSource().getFeatures()) {
    if (!ownerships[feature.get(FIELD_OWNER)])
      ownerships[feature.get(FIELD_OWNER)] = [];
    ownerships[feature.get(FIELD_OWNER)].push(feature.getId());
  }

  download_file('ownerships.json', JSON.stringify(ownerships));
}

function create_connection_file() {
  let connection = {};

  let features = map.getLayers().item(1).getSource().getFeatures();

  console.log("CREATING CONNECTION FILE, PLEASE WAIT...");

  for (let feature1 of features) {
    let id1 = feature1.getId();
    let poly1 = to_poly(feature1);

    if (!connection[id1])
      connection[id1] = [];

    for (let feature2 of features) {
      let id2 = feature2.getId();
    if (!connection[id2])
      connection[id2] = [];

      // save up time
      if (id1 == id2)
        continue;
      if (connection[id1].includes(id2))
        continue;
      if (connection[id2].includes(id1))
        continue;

      let poly2 = to_poly(feature2);

      try {
        let intersect = turf.intersect(poly1, poly2);

        // check if the 2 polygons intersect
        if (intersect) {
          connection[id1].push(id2);
          connection[id2].push(id1);
        }
      } catch(e) {
        console.error(e);
        console.log(id1, poly1, feature1.getProperties());
        console.log(id2, poly2, feature2.getProperties());

        return;
      }
    }
  }

  console.log("... done");
  download_file('connection.json', JSON.stringify(connection));
}


window.create_connection_file = create_connection_file;
window.create_ownership_file = create_ownership_file;


map.on('click', function(event) {

  if (event.pointerEvent.ctrlKey)
    selects[1] = null;
  else
    selects[0] = null;

  map.forEachFeatureAtPixel(event.pixel, function(feature) {
    if (event.pointerEvent.ctrlKey)
      selects[1] = feature;
    else
      selects[0] = feature;
  });

  areaLayer.getSource().changed();
});

//NUTS_RG_10M_2016_3857_LEVL_2
fetch('/geojson/areas.geojson')
.then(function(response) { return response.json(); })
.then(function(gjson){
  var source = areaLayer.getSource();
    
  source.addFeatures((new ol.format.GeoJSON()).readFeatures(
    gjson,
    {featureProjection: ol.proj.get('EPSG:3857')}
  ));

  // fetch('/getmode')
  // .then(function(response) { return response.json(); })
  // .then(function(mode){

  //   for (var nuts_id in mode) {
  //     source.getFeatureById(nuts_id).set(FIELD_OWNER, mode[nuts_id]);
  //   }
  // });
});


let contextmenuItems = [
  {
    text: 'Merge',
    callback: function() {
      if (!selects[0] || !selects[1])
        return;

      let feature = merge(selects[0], selects[1]);
      let filename = 'merge_'+selects[0].getId()+'_'+selects[1].getId()+'.geojson';

      let source = areaLayer.getSource();

      source.removeFeature(selects[0]);
      source.removeFeature(selects[1]);

      source.addFeature(feature);

      selects[0] = feature;
      selects[1] = null;

      //download_file(filename, JSON.stringify(cont));
      areaLayer.getSource().changed();
    }
  },
  // {
  //   text: 'Exclude',
  //   callback: function() {
  //     if (!selects[0] || !selects[1])
  //       return;

  //     let cont = exclude(selects[0], selects[1]);
  //     let filename = 'exclude_'+selects[0].getId()+'_'+selects[1].getId()+'.geojson';

  //     //download_file(filename, JSON.stringify(cont));
  //     areaLayer.getSource().changed();
  //   }
  // },
  '-',
  {
    text: 'Edit name',
    callback: function() {
      if (!selects[0])
        return;
      let name = prompt('Enter name:', selects[0].get(FIELD_NAME));

      if (name)
        selects[0].set(FIELD_NAME, name);

      areaLayer.getSource().changed();
    }
  },
  {
    text: 'Set country',
    callback: function() {
      if (!selects[0])
        return;

      let ISO = prompt('Enter iso:', selects[0].get(FIELD_OWNER));

      if (ISO)
        selects[0].set(FIELD_OWNER, ISO);

      areaLayer.getSource().changed();
    }
  },
  '-',
  {
    text: 'Delete',
    callback: function() {
      if (!selects[0])
        return;

      areaLayer.getSource().removeFeature(selects[0]);
    }
  },
  '-',
  {
    text: 'Download',
    callback: function() {
      let cont = to_poly(selects[0]);

      let filename = selects[0].getId()+'.geojson';

      download_file(filename, JSON.stringify(cont));
    }
  },
  {
    text: 'Download All',
    callback: function() {

      download_all();
    }
  },
  '-',
  {
    text: 'Properties',
    callback: function() {
      console.log(selects[0].getProperties());
    }
  },
];