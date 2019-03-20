export const unitSource = new ol.source.Vector();
import {getColor, getFlag, img_dim} from '/js/game/colors.js';
import {turn} from '/js/game/store.js';
import {getUnitComposition} from '/js/game/lib.js';

// todo: fixme: this doesn't prevent overlap
let zIndex = 0;
// number of layers per unit image
const zLayers = 4;

export const unitLayer = new ol.layer.Vector({
  source: unitSource,

  style: (feature, res) => {
    let styles = [];
    let unit = feature.getProperties();
    let diplo = turn.me == unit.iso ? '_ally' : '_enemy';

    styles.push(new ol.style.Style({
      image: new ol.style.Icon({
        src: "/img/map/unit"+diplo+".png",
        scale: 0.95
      }),
    }));

    // display country flag
    styles.push(new ol.style.Style({
      zIndex: (zIndex*zLayers)+1,
      // flag
      image: new ol.style.Icon(({
        img: getFlag(unit.iso),
        imgSize: [img_dim.w, img_dim.h],
        scale: 0.098,
        anchorXUnits: 'pixels',
        anchorOrigin: 'top-right',
        anchor: [-200, 0.5],
      }))
    }));

    // unit class
    let offset_x = -8;

    if (unit.uclass != 'inf') {
      styles.push(new ol.style.Style({
        zIndex: (zIndex*zLayers)+2,

        image: new ol.style.Icon({
          src: "/img/map/class-"+unit.uclass+".png",

          scale: 0.5,
          anchorXUnits: 'pixels',
          anchorOrigin: 'top-right',
          anchor: [8, 0.5],
        }),
      }));

      offset_x += 20;
    }

    // display unit type, if it matters
    styles.push(new ol.style.Style({
      zIndex: (zIndex*zLayers)+3,

      text: new ol.style.Text({
        offsetX: offset_x,
        offsetY: 2,

        fill: new ol.style.Fill({
          color: 'white'
        }),
        text: unit.mils.estimation()
      })
    }));

    if (unit.utype) {
      styles.push(new ol.style.Style({
        zIndex: (zIndex*zLayers)+4,

        image: new ol.style.Icon({
          src: "/img/map/unit-"+unit.utype+".png",

          scale: 0.5,
          anchorXUnits: 'pixels',
          anchorOrigin: 'top-left',
          anchor: [-54, 0.5],
        }),
      }));
    }

    // increment zIndex, so that different units overlap nicely
    zIndex+=1;
    if (zIndex > 1000) 
      zIndex = 0;

    return styles;
  }
});

unitLayer.name = 'units';
