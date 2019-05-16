//import {moveUnits, setUnits, clearUnits, conquer} from '/js/ol/gfx.js';
//import {match, EVENT} from "/js/game/store.js";
import {areaSource} from '/js/ol/layers/areas.js';


export class AreasGroup {
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
        let feature = format.readFeature(area);

        if (areaSource.getFeatureById(area.id))
          continue;

        if (!feature.get('units')) feature.set('units', []);
        if (!feature.get('virgin')) feature.set('virgin', true);
        if (!feature.get('castle')) feature.set('castle', 0);

        areaSource.addFeature(feature);
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