import {colors} from "/engine/colors.js";

export const outlineLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: '/geojson/continents.json',
    format: new ol.format.GeoJSON()
  }),
  style: function() {

    return new ol.style.Style({
      fill: new ol.style.Fill({
        color: colors.base.rgb()
      }),
      stroke: new ol.style.Stroke({
        color: '#284d00',
        width: 2.0
      }),
    });
  }
});

outlineLayer.name = "outline";
