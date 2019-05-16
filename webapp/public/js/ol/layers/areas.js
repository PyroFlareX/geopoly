import {load} from '/js/game/loader.js';
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

export const areaSource = new ol.source.Vector({
  //format: new ol.format.GeoJSON(),
  //url: '/geojson/areas.geojson',
});

export const areaLayer = new ol.layer.Vector({
  source: areaSource,

  style: (feature, res) => {
    let styles = [];

    let selected = feature.get('selected');
    let castle = feature.get('castle');
    let units_team = feature.get('units').filter(unit => unit.get('role') == 'team');

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
    }));

    if (castle) {
      if (!feature.get('cen')) {
        console.error("Centroid not found for", feature.getId());
        return;
      }

      styles.push(new ol.style.Style({
        image: new ol.style.Icon(({
          src: '/img/map/castle'+feature.get('castle')+'.png',
          //imgSize: [32, 32],
          scale: 0.4
        })),
        geometry: new ol.geom.Point(feature.get('cen'))
      }));
    }

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
    hovered.set('hovered', false);
  }

  feature.set('hovered', true);
  hovered = feature;
  $("#app-map").style.cursor = "url('/img/map/claim-cursor.png'), default";

  onHoverUnits(feature);
};

areaLayer.hover_out = () => {
  if (hovered) {
    hovered.set('hovered', false);
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


// load(function() {
//   let lk = areaSource.on('change', (e) => {
//     if (areaSource.getState() == 'ready') {

//       // something else than load happened, wait
//       if (areaSource.getFeatures().length == 0)
//         return;

//       // and unregister the "change" listener 
//       ol.Observable.unByKey(lk);

//       console.log("Loaded layers");
//       this.loaded();
//     }
//   });
// });
