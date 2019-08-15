import {load, onload} from '/engine/loader.js';
import {getColor, getMapBlend, getHighlight, colors} from '/engine/colors.js';
import {openRandom} from '/engine/gfx/jumpto.js';
import {world, countries} from '/engine/modules/worlds/world.js';

/**
 * Area layer
 * 
 */
// todo: later: download as zip & unzip
export const areaSource = new ol.source.Vector({
  format: new ol.format.GeoJSON(),
  url: `/maps/${window.world_map}.geojson`,
});

export const areaLayer = new ol.layer.Vector({
  source: areaSource,
  maxResolution: 4000,

  style: (feature, res) => {
    const styles = [];

    const selected = feature.get('selected');
    const hovered = feature.get('hovered');

    const point_cen = new ol.geom.Point(feature.get('cen'));

    const area_id = feature.get('id');
    const color = getColor(feature);
    const dark_bg = getHighlight(color);
    let bg = getMapBlend(color, feature.get('iso'));

    // todo: account for multiply colorscheme!
    // area borders & country color
    styles.push(new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: colors.base_edge.rgb(),
        //color: color.rgb(),
        width: 1
      }),
      fill: new ol.style.Fill({
        color: hovered ? dark_bg.rgb() : bg.rgb()
      }),
    }));
    
    if (hovered) {
      styles.push(new ol.style.Style({
        text: new ol.style.Text({
          text: feature.get('name'),
          fill: new ol.style.Fill({color: dark_bg.rgb()}),
          stroke: new ol.style.Stroke({color: dark_bg.contrast(), width: 3}),
          font: '14px "Opera Lyrics"',
          offsetY: 28,
        }),
        geometry: point_cen
      }));
    }  

    // add tile icon
    const tile = feature.get('tile');
    const build = feature.get('build');

    if (build || tile) {
      const tile_icon = build ? 'build-'+build : 'tile-'+tile;

      styles.push(new ol.style.Style({
        image: new ol.style.Icon(({
          color: hovered ? dark_bg.shade(-0.5).rgb() : bg.shade(-0.5).rgb(),
          //castle || hovered || selected ? dark_bg.rgb() : bg.a(0.3).rgb(),
          //_${bg.contrast()}
          src: `/img/map/${tile_icon}.png`,
          //imgSize: [32, 32],
          scale: 0.4
        })),
        geometry: point_cen
      }));
    }

    const unit = feature.get('unit');
    if (unit) {
      let uicon = hovered ? unit+'-mark' : unit;
      styles.push(new ol.style.Style({
        image: new ol.style.Icon(({
          src: `/img/map/unit-${uicon}.png`,
          scale: 0.4
        })),
        text: (hovered || selected) ? new ol.style.Text({
          text: feature.get('name'),
          fill: new ol.style.Fill({color: dark_bg.rgb()}),
          stroke: new ol.style.Stroke({color: dark_bg.contrast(), width: 3}),
          font: '14px "Opera Lyrics"',
          offsetY: 28,
        }) : null,
        geometry: new ol.geom.Point(feature.get('cen'))
      }));
    }

    return styles;
  }
});
areaLayer.name = 'areas';


areaLayer.click = (feature, key) => {
  let iso = feature.get('iso');

  if (!world.me && world.can_join) {
    // Claim feature on click

    if (countries[iso].player.default && !world.isos.includes(iso)) {
      gui.dialog("join-world", world, iso, feature.getId(), feature.get('name'));
    }
    return;
  }

  if (!key) {
    // @temporal
    // feature.getId(), 
    // Select and move units standing on area
    //onSelectUnits(feature);

    // select area / castle too:
  } else if (key == 'CTRL') {
    // todo: later: info popover, instead of console log

    console.log(feature.getId(), iso, feature.getProperties());
  }
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
    switch(key) {
      case 'Q':
        // todo: move unit
      break;
      case 'W':
        console.log(gui.opened)
        if (gui.opened && gui.opened == 'buy-units-'+feature.get('id')) {
          gui.infobar('close');
        }
        gui.infobar("buy-units", feature.getProperties(), world);
      break;
      case 'E':
        if (gui.opened && gui.opened == 'buy-builds-'+feature.get('id')) {
          gui.infobar('close');
        }
        gui.infobar("buy-builds", feature.getProperties(), world);
      break;
      case 'R':
        // reserved
      break;
    }
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

  //onHoverUnits(feature);
};

areaLayer.hover_out = () => {
  if (hovered) {
    hovered.set('hovered', false);
    hovered = null;
  }

  $("#app-map").style.cursor = "";
  
  //hideHoverArrow();
};

load(function() {
  var listenerKey = areaSource.on('change', (e) => {
    if (areaSource.getState() == 'ready' && len(areaSource.getFeatures()) > 0) {
      ol.Observable.unByKey(listenerKey);
      this.loaded();
    }
  });
});
