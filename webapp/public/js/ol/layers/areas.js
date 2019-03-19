/**
 * Area layer
 * 
 * layer, style, source
 * onmousemove, onclick, 
 */
export const areaSource = new ol.source.Vector({
  format: new ol.format.GeoJSON(),
  url: '/geojson/test_europe.json',
});


export const areaLayer = new ol.layer.Vector({
  source: areaSource,

  //style: (area, res) => {

  //}
});

areaLayer.click = (feature, key) => {
  let iso = feature.get('iso');

  if (key == 'CTRL') {
    console.log("click CTRL", iso);
  }
  else if (key == 'SHIFT') {
    console.log("click SHIFT", iso);
  }
  else if (key == 'ALT') {
    console.log("click ALT", iso);
  }
  else if (key != null) {
    console.log("click " + key, iso);    
  }
  else {
    console.log("click regular", iso);
  }
};

areaLayer.hover = () => {
  // todo
};

areaLayer.drop = () => {
  // todo: only call when translate event was fully handled
};

areaLayer.keypress = (feature, key) => {
  let iso = feature.get('iso');

  console.log("keypress " + key, iso);
};

areaLayer.contextmenu = () => {
  // todo
};

