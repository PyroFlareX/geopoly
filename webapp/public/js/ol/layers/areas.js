import {onload} from '/js/game/loader.js';
import {getUnits} from '/js/game/lib.js';
import {match, countries} from '/js/game/store.js';
import {onSelectUnits, onHoverUnits, onCancelSelection, hideHoverArrow} from '/js/ol/units.js';
import {openRandom} from '/js/ol/areas.js';
import {getColor, getMapBlend, getHighlight} from '/js/game/colors.js';


/**
 * Area layer
 * 
 * layer, style, source
 * onmousemove, onclick, 
 */

// todo: later: download as zip & unzip
export const areaSource = new ol.source.Vector({
  format: new ol.format.GeoJSON(),
  url: '/geojson/areas.geojson',
});

const cache = {};

export const areaLayer = new ol.layer.Vector({
  source: areaSource,
  maxResolution: 4000,

  style: (feature, res) => {
    const styles = [];

    const visible = feature.get('visible');
    const selected = feature.get('selected');
    const hovered = feature.get('hovered');

    const area_id = feature.get('id');
    const castle = feature.get('castle') || 0;
    const color = getColor(feature);
    const bg = getMapBlend(color, feature.get('iso'));
    const dark_bg = getHighlight(color);

    // todo: account for multiply colorscheme!
    if (visible) {
      if (hovered)
        bg = dark_bg;

      // area borders & country color
      styles.push(new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: color.rgb(),
          width: 1
        }),
        fill: new ol.style.Fill({
          color: bg.rgba()
        }),
      }));
    }
  
    styles.push(new ol.style.Style({
      image: new ol.style.Icon(({
        color: castle || hovered || selected || visible ? dark_bg.rgb() : bg.a(0.3).rgb(),
        src: `/img/map/castle${castle}_${dark_bg.contrast()}.png`,
        //imgSize: [32, 32],
        scale: 0.4
      })),
      text: (hovered || selected || visible) ? new ol.style.Text({
        text: feature.get('name'),
        fill: new ol.style.Fill({color: dark_bg.rgb()}),
        stroke: new ol.style.Stroke({color: dark_bg.contrast(), width: 3}),
        font: '14px "Opera Lyrics"',
        offsetY: 28,
      }) : null,
      geometry: new ol.geom.Point(feature.get('cen'))
    }));


    return styles;
  }
});

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
    // Select and move units standing on area
    onSelectUnits(feature);

    // select area / castle too:
  } else if (key == 'CTRL') {
    // todo: later: info popover, instead of console log

    console.log(feature.getId(), iso, feature.getProperties());
  }
};

let hovered = null;

areaLayer.hover = (feature) => {
  if (hovered) {
    hovered.set('visible', false);
  }

  feature.set('visible', true);
  hovered = feature;
  $("#app-map").style.cursor = "url('/img/map/claim-cursor.png'), default";

  onHoverUnits(feature);
};

areaLayer.hover_out = () => {
  if (hovered) {
    hovered.set('visible', false);
    hovered = null;
  }

  $("#app-map").style.cursor = "";
  
  hideHoverArrow();
};

areaLayer.drop = () => {
  // todo: only call when translate event was fully handled
};

areaLayer.keypress = (feature, key) => {
  if (key == 'ESCAPE') {
    let prevent = onCancelSelection();

    // special case, escape is not smartcast, but it always cancels selection
    if (!prevent) {
      // close infobars
      gui.infobar('close');
      gui.dialog('close');
    }
  }
  else if (key == 'SPACE' || key == ' ') {
    // jump to random area
    openRandom();
  }
  else {
    let infobar;
    switch(key) {
      case 'Q':
        infobar = 'area';
      break;
      case 'W':
        infobar = 'training';

        if (!feature.get('castle')) 
          infobar = 'close';
        // todo: if not mine
      break;
      case 'E':
        infobar = 'team';

        if (!feature.get('castle')) 
          infobar = 'units';

        // todo: if not mine, disable input in team window 
      break;
      case 'R':
        infobar = 'building';

      break;
    }

    if (gui.opened && gui.opened == infobar+'_'+feature.get('id')) {
      gui.infobar('close');
    } else {
      // if (key != 'Q' && match.me != ) {
        
      // }
      onCancelSelection();
      
      gui.infobar(infobar, feature);
    }
  }
};

areaLayer.contextmenu = () => {
  // todo
};
