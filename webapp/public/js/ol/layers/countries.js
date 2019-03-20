export const countrySource = new ol.source.Vector();
import {getColor, getMapBlend, getHighlight} from '/js/game/colors.js';
import {offsetGeometry} from '/js/ol/gfx.js';

export const countryLayer = new ol.layer.Vector({
  source: countrySource,

  style: (feature, res) => {
    let styles = [];
    let country = feature.getProperties();

    let color = getColor(country);
    let selected = feature.get('selected', false);

    if (selected)
      color = getHighlight(color);
    else
      color = getMapBlend(color);

    // country style:
    styles.push(new ol.style.Style({
      fill: new ol.style.Fill({
        color: color.rgba()
      }),
    }));

    return styles;
  }
});

countryLayer.name = 'countries';
