import {load} from '/js/game/loader.js';
import {getColor} from '/js/game/colors.js';
import {getUnits} from '/js/game/lib.js';
import {showHoverArrow, initHoverArrow, hideHoverArrow, showMoveDialog} from '/js/ol/gfx.js';

/**
 * Area layer
 * 
 * layer, style, source
 * onmousemove, onclick, 
 */

export const areaSource = new ol.source.Vector({
  format: new ol.format.GeoJSON(),
  url: '/geojson/NUTS_RG_01M_2016_3857_LEVL_0.geojson',
});

export const areaLayer = new ol.layer.Vector({
  source: areaSource,

  style: (feature, res) => {
    let styles = [];

    let selected = feature.get('selected', false);
    let color = getColor(feature);

    // area borders (inner ones)
    styles.push(new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: color.rgb(),
        width: 1
      }),

      // hack so that area is clickable
      fill: new ol.style.Fill({
        color: 'rgba(255,255,255,0)'
      }),
    }));

    return styles;
  }
});

const move = {
  selected: null,
}

areaLayer.name = 'areas';

areaLayer.click = (feature, key) => {
  let iso = feature.get('iso');

  if (!key) {
    // Move feature

    if (!move.selected) {
      let mils = getUnits(feature);

      // todo: check if mine
      if (mils > 0) {
        feature.set('selected', true);
        
        initHoverArrow(feature);
        move.selected = feature;
      }
    } else {
      showMoveDialog(move.selected, feature);

      move.selected = null;
    }
  } else if (key == 'CTRL') {
    console.log(feature.getId(), iso, feature.getProperties());
  }
};

areaLayer.hover = (feature) => {
  if (move.selected) {
    // draw arrow from selected to this feature
    showHoverArrow(feature);
  }
};

areaLayer.drop = () => {
  // todo: only call when translate event was fully handled
};

areaLayer.keypress = (feature, key) => {
  let iso = feature.get('iso');

  if (key == 'Q' || key == 'CTRL') {
    // open area infobar

    gui.infobar('area', feature);
  }
};

areaLayer.contextmenu = () => {
  // todo
};


load(function() {
  let lk = areaSource.on('change', (e) => {
    if (areaSource.getState() == 'ready') {
      // and unregister the "change" listener 
      ol.Observable.unByKey(lk);

      this.loaded();
    }
  });
});
