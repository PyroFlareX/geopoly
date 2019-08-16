import {load, onload} from '/engine/loader.js';
import {getColor, getMapBlend, getHighlight, colors} from '/engine/colors.js';
import {world, countries} from '/engine/modules/worlds/world.js';
import {openRandom} from '/engine/gfx/jumpto.js';
import {show_arrow, set_arrow, hide_arrow} from '/engine/gfx/arrows.js';

import {client} from '/js/client.js';
import {validate_move} from '/js/game/moves.js';

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

export const move = {
  selected: null,

  disable_tooltip: false,
};

areaLayer.click = (feature, key) => {
  let iso = feature.get('iso');

  if (!world.me && world.can_join) {
    // Claim feature on click

    if (countries[iso].player.default && !world.isos.includes(iso)) {
      gui.dialog("join-world", world, iso, feature.getId(), feature.get('name'));
    }
    return;
  }

  if (move.selected) {
    // move-arrow click: ending
    if (gui.opened == 'move-info' && !move.disable_tooltip) {
      gui.infobar("close");
    }

    if (validate_move(move.selected, feature)) {
      client.ws.request('Areas:move', {
        from_id: move.selected.getId(),
        to_id: feature.getId()
      });
    } else {
      console.log("TODO: flash: can't move there");
    }

    hide_arrow();
    move.selected = null;
  }

  if (!key) {
    // https://www.youtube.com/watch?v=1KC2-EZ1ee0

    if (world.me == iso) {
      // selecting my owned area
      const nam = gui.opened ? gui.opened.substr(0,9) : null;

      // remember last selected infobar:
      if (nam == 'buy-units')
        gui.infobar("buy-units", feature.getProperties(), world);
      else if (nam == 'buy-build')
        gui.infobar("buy-builds", feature.getProperties(), world);
      else if (nam == 'area-info')
        gui.infobar("area-info", feature.getProperties(), world);
      else {
        // smart-guess of what you want to do

        if (feature.get('unit')) {
          // area has unit, start&stopmoving
          if (!move.disable_tooltip)
            gui.infobar("move-info", feature.getProperties());

          show_arrow(feature);
          move.selected = feature;

        } else if (feature.get('tile') == 'city') {
          // unit-less city, open unit dialog
          gui.infobar("buy-units", feature.getProperties(), world);
        } else {
          // empty area, open build dialog
          gui.infobar("buy-builds", feature.getProperties(), world);
        }
      }
    } else {
      // we click on other's area: open area info
      gui.infobar("area-info", feature.getProperties(), world);
    }
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
        if (gui.opened && gui.opened == 'area-info-'+feature.get('id')) {
          gui.infobar('close');
        }
        gui.infobar("area-info", feature.getProperties(), world);
      break;
      case 'W':
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


  if (move.selected) {
    //  validate if can move
    if (validate_move(move.selected, feature)) {
      // change move arrow & tooltip gui
      set_arrow(feature);

      if (gui.opened == 'move-info') {
        gui.opened_comp.set_to(feature);
      }
    } else {
      // hide arrow & tooltip gui
      hide_arrow();

      if (gui.opened == 'move-info') {
        gui.opened_comp.set_to(null);
      }
    }
  }
};

areaLayer.hover_out = () => {
  if (hovered) {
    hovered.set('hovered', false);
    hovered = null;
  }

  $("#app-map").style.cursor = "";

  hide_arrow();

  if (gui.opened == 'move-info' && gui.opened_comp)
    gui.opened_comp.set_to(null);
};


load(function() {
  var listenerKey = areaSource.on('change', (e) => {
    if (areaSource.getState() == 'ready' && len(areaSource.getFeatures()) > 0) {
      ol.Observable.unByKey(listenerKey);
      this.loaded();
    }
  });
});
