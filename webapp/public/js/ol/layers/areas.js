import {load} from '/js/game/loader.js';
import {getColor} from '/js/game/colors.js';
import {getUnitComposition, getUnits} from '/js/game/lib.js';
import {showHoverArrow, initHoverArrow, hideHoverArrow, showMoveDialog} from '/js/ol/gfx.js';

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

  style: (feature, res) => {
    let styles = [];
    let area = feature.getProperties();

    let color = getColor(area);
    let selected = feature.get('selected', false);

    // area style:
    styles.push(new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 1
      }),
      fill: new ol.style.Fill({
        color: selected ? color.blend(new Color(255, 255, 255), 'softlight').rgb() : color.rgb()
      })
    }));

    // show units
    let [mils, uclass, utype] = getUnitComposition(area);
    if (mils > 0) {

      styles.push(new ol.style.Style({
        image: new ol.style.Icon({
          src: "/img/map/unit.png",
          scale: 0.95
        }),
        text: new ol.style.Text({
          text: uclass +' '+ utype+' ' + mils.estimation(),
          fill: new ol.style.Fill({color: "white"}),
          stroke: new ol.style.Stroke({color: "black", width: 3}),
        }),

        geometry: new ol.geom.Point(area.cen)
      }));
    }

    return styles;
  }
});

const move = {
  selected: null,
}

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
      showMoveDialog(feature, move.selected);

      move.selected = null;
    }
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
