//import {moveUnits, setUnits, clearUnits, conquer} from '/js/ol/gfx.js';
//import {match, EVENT} from "/js/world.js";
//import {areaSource} from '/js/ol/layers/areas.js';
//import {addArea} from '/js/ol/areas.js';

export class AreasController {
  constructor(client) {
    this.client = client;
  }

  request_vision(area) {
    if (area.get('revealed'))
      return;

    let area_id = area.getId();

    fetch('/areas/radius/'+area_id, {})
    .then((resp) => { return resp.json() })
    .then(function({areas}) {
      area.set('revealed', true);
      
      // add new areas
      const format = new ol.format.GeoJSON();

      for (let area of areas) {
        addArea(area, format);
      }
    });
  }

  request_training(area_id, prof) {
    let formData = new FormData();
    formData.append('prof', prof);

    fetch('/areas/training/'+area_id, {
      method: "POST",
      body: formData
    })
    .then((resp) => { return resp.json() })
    .then(function() {
      // ok
    });
  }
}