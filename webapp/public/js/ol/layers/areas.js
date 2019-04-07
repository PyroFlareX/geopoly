import {load} from '/js/game/loader.js';
import {getUnits} from '/js/game/lib.js';
import {match, countries} from '/js/game/store.js';
import {showHoverArrow, initHoverArrow, hideHoverArrow, showMoveDialog, jumpToRandom} from '/js/ol/gfx.js';
import {getColor, getMapBlend, getHighlight} from '/js/game/colors.js';

/**
 * Area layer
 * 
 * layer, style, source
 * onmousemove, onclick, 
 */

export const areaSource = new ol.source.Vector({
  format: new ol.format.GeoJSON(),
  url: '/geojson/areas.geojson',
});

export const areaLayer = new ol.layer.Vector({
  source: areaSource,

  style: (feature, res) => {
    let styles = [];

    let selected = feature.get('selected');

    // todo: account for multiply colorscheme!
    let color = getColor(feature);
    let bg = getMapBlend(color, feature.get('iso'));

    if (feature.get('hovered'))
      bg = getHighlight(color);

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


  if (!match.me && match.can_join) {
    // Claim feature on click

    if (countries[iso].player.default && !match.isos.includes(iso)) {
      gui.dialog("join-match", match, iso, feature.getId(), feature.get('name'));
    }
    return;
  }

  if (!key) {
    // Move feature

    if (!move.selected) {
      // only select my area
      if (match.me != iso) {
        return;
      }

      let mils = getUnits(feature);

      if (mils > 0) {
        feature.set('selected', true);
        
        initHoverArrow(feature);
        move.selected = feature;
      }
    } else {
      // check if we can move there
      if (move.selected.get('conn') && !move.selected.get('conn').includes(feature.getId()))
        return;

      showMoveDialog(move.selected, feature);

      move.selected = null;
    }
  } else if (key == 'CTRL') {
    // todo: later: info popover, instead of console log

    console.log(feature.getId(), iso, feature.getProperties());
  }
};

let hovered = null;
areaLayer.hover = (feature) => {
  if (hovered) {
    hovered.set('hovered', false);
  }

  feature.set('hovered', true);
  hovered = feature;
  $("#app-map").style.cursor = "url('/img/map/claim-cursor.png'), default";


  if (move.selected) {
    // check if we can move there
    if (move.selected.get('conn')) {
      if (!move.selected.get('conn').includes(feature.getId())) {
        hideHoverArrow();

        return;
      }
    }

    if (feature.getId() != move.selected.getId()) {
      // todo: check if two areas are connected!

      // draw arrow from selected to this feature
      showHoverArrow(feature);
    }
  }
};

areaLayer.hover_out = () => {
  if (hovered) {
    hovered.set('hovered', false);
    hovered = null;
  }

  $("#app-map").style.cursor = "";
  
  if (move.selected) {
    hideHoverArrow();
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

    // special case, escape is not smartcast, but it always cancels selection
    if (!prevent) {
      // close infobars
      gui.infobar('close');
      gui.dialog('close');
    }
  }

  else if (key == 'SPACE' || key == ' ') {
    // jump to random area
    jumpToRandom(match.me, false);
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
