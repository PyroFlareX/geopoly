import {getColor} from '/js/game/colors.js';

/**
 * Arrows layer
 * 
 * layer, style, source
 * 
 */


export const arrowSource = new ol.source.Vector();

export const arrowLayer = new ol.layer.Vector({
  source: arrowSource,
  style: function(feature) {
    if (feature.get('hide'))
      return null;

    let coords = feature.getGeometry().getCoordinates();
    let angle = Math.atan2(coords[1][1] - coords[0][1], coords[1][0] - coords[0][0]);
    let rotation = Math.PI / 2 - angle;

    let units = feature.get('units');
    let color = getColor(feature.get('iso'));

    let styles = [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: color.rgb(),
          width: 8
        }),
        text: new ol.style.Text({
          text: units.estimation(),
          fill: new ol.style.Fill({color: "white"}),
          stroke: new ol.style.Stroke({color: "black", width: 3}),
          font: '16px "Opera Lyrics"'
        })
      }),

      new ol.style.Style({
        image: new ol.style.Icon({
          src: "/img/map/arrow.png",
          rotation: rotation
        }),
        geometry: new ol.geom.Point(coords[1])
      }),
    ];

    return styles;
  }
});

arrowLayer.name = 'arrows';
