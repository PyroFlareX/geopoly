import {addArea} from '/js/ol/areas.js';

export function init_test() {

  //let path = find_path('PL721', 'RO423');


  //console.log(path);
}

window.load_all = function() {

  fetch('/areas', {})
  .then((resp) => { return resp.json() })
  .then(function({areas}) {
    // add new areas
    const format = new ol.format.GeoJSON();

    for (let area of areas) {
      addArea(area, format);
    }
  });
}