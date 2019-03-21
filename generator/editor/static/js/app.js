var baseLayer = new ol.layer.Tile({
  source: new ol.source.OSM()
});

var areaLayer = new ol.layer.Vector({
  source: new ol.source.Vector(),
  style: function(feature) {
    var iso = feature.get('CNTR_CODE');

    if (!iso)
      var col = 'rgba(0,0,0,0.6)';
    else if (iso.length == 5) {
      var col = 'rgba(50,50,50,0.2)';
    } else {
      var seed = 107*iso.charCodeAt(0) * 107*iso.charCodeAt(1);
      var rng = new SRNG(seed);
      var rng2 = new SRNG(iso.length<=2?1:parseInt(iso.substring(3)));

      var col = 'rgba('+(rng.random()*200+rng2.random()*50)+','+(rng.random()*200+rng2.random()*50)+','+(rng.random()*200+rng2.random()*50)+',0.6)';
    }

    var styles = [new ol.style.Style({
      fill: new ol.style.Fill({
        color: col
      }),
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 0.5
      }),
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
    riverLayer,
  ],
  view: new ol.View({
    center: _center,
    zoom: _zoom,
    minZoom: 3,
    maxZoom: 8,
  })
});

var onlyShow = null;
map.on('click', function(event) {
  map.forEachFeatureAtPixel(event.pixel, function(feature,layer) {
    console.log(feature.getProperties())
    //if (typeof feature.get('CNTR_CODE') === 'undefined')
    //  return;

    if (currIso())
      setiso(feature, currIso());
    else
      removeiso(feature, currIso());
  });
});

map.getViewport().addEventListener('contextmenu', function (evt) {
  evt.preventDefault();

  var found = false;
  map.forEachFeatureAtPixel(map.getEventPixel(evt), function(feature,layer) {
    //if (typeof feature.get('CNTR_CODE') === 'undefined')
    //  return;
    
    document.getElementById('echo').innerHTML = feature.get('NUTS_NAME') + ' - ' + feature.getId() + ' - ' + feature.get('CNTR_CODE')

    found = true;
  });
});

function currIso() {
  return document.getElementById('curr_iso').value;
}

function setiso(feature, iso) {
  fetch('/setiso', {
    method: "POST",
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      id: feature.getId(),
      iso: iso
    })
  }).then(function(){
    feature.set('CNTR_CODE', iso);
    areaLayer.getSource().changed();
  });
}

function removeiso(feature) {
  fetch('/removeiso', {
    method: "POST",
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      id: feature.getId()
    })
  }).then(function(){
    feature.set('CNTR_CODE', feature.get('iso0'));
    areaLayer.getSource().changed();
  });
}

fetch('/static/NUTS_RG_10M_2016_3857_LEVL_2.geojson')
.then(function(response) { return response.json(); })
.then(function(gjson){
  var source = areaLayer.getSource();
    
  source.addFeatures((new ol.format.GeoJSON()).readFeatures(
    gjson,
    {featureProjection: ol.proj.get('EPSG:3857')}
  ));

  fetch('/getmode')
  .then(function(response) { return response.json(); })
  .then(function(mode){

    for (var nuts_id in mode) {
      source.getFeatureById(nuts_id).set('CNTR_CODE', mode[nuts_id]);
    }
  });
});
