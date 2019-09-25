import {load, onload} from '/engine/loader.js';
import {getColor, getMapBlend, getHighlight, colors} from '/engine/colors.js';
import {world} from '/engine/modules/worlds/world.js';
import {openRandom} from '/engine/gfx/jumpto.js';

import {client} from '/js/client.js';
import {area_select, area_target} from '/js/game/moves.js';
import {test_action} from '/js/test.js';

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
  //maxResolution: 2445,

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
      const exhausted = feature.get('exhaust') > 0;
      let uicon = hovered ? unit+'-mark' : unit;

      styles.push(new ol.style.Style({
        image: new ol.style.Icon(({
          src: `/img/map/unit-${uicon}.png`,
          scale: 0.4,
          color: exhausted ? colors.exhausted.rgb() : undefined
        })),
        // text: (hovered || selected) ? new ol.style.Text({
        //   text: feature.get('name'),
        //   fill: new ol.style.Fill({color: dark_bg.rgb()}),
        //   stroke: new ol.style.Stroke({color: dark_bg.contrast(), width: 3}),
        //   font: '14px "Opera Lyrics"',
        //   offsetY: 28,
        // }) : null,
        geometry: new ol.geom.Point(feature.get('cen'))
      }));
    }

    return styles;
  }
});
areaLayer.name = 'areas';


areaLayer.click = (feature, key) => {
  if (feature) {
    // clicked on a feature
    if (key == 'CTRL') {
      test_action(feature);
      return;
    } else {
      // Left click makes units move
      area_select(feature);
    }
  } else {
    // clicked outside the map
    area_select(null);
  }
};

areaLayer.rightclick = (feature, key) => {
  if (feature) {
    // right clicked on a feature
    const iso = feature.get('iso');

    if (world.me == iso) {
      // Open buy panels for my areas

      if (feature.get('tile') == 'city') {
        // buy g
        gui.infobar('buy-units', feature, world);
      } else {
        // empty tile -> we definitely want to buy tiles
        gui.infobar('buy-tiles', feature, world);
      }
    } else {
      // not my area, nothing to do
    }
  } else {
    // right clicked outside the map
  }
};

areaLayer.keydown = (feature, key) => {
  if (key == 'ESCAPE') {
    // cancel move selection
    area_select(null);

    // exit GUI popovers
    gui.quit();
  }

  else if (key == 'SPACE' || key == ' ') {
    // jump to random city area
    openRandom((feature)=>{
      return feature.get('iso') == world.me && feature.get('tile') == 'city';
    });
  }

  else if (key == 'TAB') {
    // toggle countries overview infobar
    if (!gui.opened)
      gui.infobar("countries");
  }
};

areaLayer.keyup = (feature, key) => {
  if (key == 'TAB') {
    // toggle countries overview infobar
    gui.quit('countries');
  }
};


let hovered = null;
areaLayer.hover = (feature) => {
  if (hovered) {
    hovered.set('hovered', false);
    hovered = null;
  }

  if (feature) {
    // hover in 
    feature.set('hovered', true);
    hovered = feature;
    //$("#app-map").style.cursor = "url('/img/map/claim-cursor.png'), default";    

  } else {
    // hover out 
    //$("#app-map").style.cursor = "";
  }

  // hovering changes the move arrow
  area_target(feature);
};


load(function() {
  var listenerKey = areaSource.on('change', (e) => {
    if (areaSource.getState() == 'ready' && len(areaSource.getFeatures()) > 0) {
      ol.Observable.unByKey(listenerKey);
      this.loaded();
    }
  });
});
