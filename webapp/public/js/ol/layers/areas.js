import {load} from '/js/game/loader.js';
import {getUnits} from '/js/game/lib.js';
import {match} from '/js/game/store.js';
import {showHoverArrow, initHoverArrow, hideHoverArrow, showMoveDialog} from '/js/ol/gfx.js';
import {getColor, getMapBlend, getHighlight} from '/js/game/colors.js';

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

    // todo: account for multiply colorscheme!
    let color = getColor(feature);
    let bg = getMapBlend(color);

    // if (selected)
    //   color = getHighlight(color);

    // area borders & country color
    styles.push(new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: color.rgb(),
        width: 1
      }),

      fill: new ol.style.Fill({
        color: bg.rgba()
      }),

      // hack so that area is clickable
      // fill: new ol.style.Fill({
      //   color: 'rgba(255,255,255,0)'
      // }),
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
      // only select my area
      if (match.me != iso) {
        return;
      }

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
    // todo: later: info popover, instead of console log

    console.log(feature.getId(), iso, feature.getProperties());
  }
};

areaLayer.hover = (feature) => {
  if (move.selected) {

    if (feature.getId() != move.selected.getId()) {
      // todo: check if two areas are connected!

      // draw arrow from selected to this feature
      showHoverArrow(feature);
    }
  }
};

areaLayer.drop = () => {
  // todo: only call when translate event was fully handled
};

areaLayer.keypress = (feature, key) => {

  if (key == 'Q' || key == 'CTRL') {
    // open area infobar

    gui.infobar('area', feature);
  }

  else if (key == 'ESCAPE') {
    let prevent = move.selected != null;

    move.selected = null;
    hideHoverArrow();

    return prevent;
  }
};

areaLayer.contextmenu = () => {
  // todo
};


load(function() {
  let lk = areaSource.on('change', (e) => {
    if (areaSource.getState() == 'ready') {

      // something else than load happened, wait
      if (areaSource.getFeatures().length == 0)
        return;

      // and unregister the "change" listener 
      ol.Observable.unByKey(lk);

      console.log("Loaded layers");
      this.loaded();
    }
  });
});
