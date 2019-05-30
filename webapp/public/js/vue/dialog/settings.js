import {template} from "/js/vue/dialog/settings.vue.js";

import {color_settings} from "/js/game/colors.js";
import {keys} from "/js/ol/map.js";

import {watercolorLayer} from '/js/ol/base/watercolor.js';
import {outlineLayer} from '/js/ol/base/outline.js';

import {areaLayer} from '/js/ol/layers/areas.js';
import {borderLayer} from '/js/ol/layers/borders.js';
//import {countryLayer} from '/js/ol/layers/countries.js';
import {unitLayer} from '/js/ol/layers/units.js';
//import {eventLayer} from '/js/ol/layers/events.js';
import {arrowLayer} from '/js/ol/layers/arrows.js';

// todo: later, fixme
let gfx = {};

export let component = Vue.component('dialog-settings', {
  template: template,
  data: function() {
    return {
      show: false,
      layers: {},

      coloring: null,
      baseLayer: null,
      blendmode: null,
      filter: null,
      stroke_color: null,
      smartcast: null,

      show_flags: null,
      show_mils: null,
      show_sites: null,
      show_unclaimed: null,
    }
  },
  created: function () {
    var layers = JSON.parse(Cookie.get('layers', '{}'));
    this.layers = layers;

    //this.coloring = layers['coloring'] || 'iso';
    this.baseLayer = layers['baseLayer'] || 'outline';
    this.blendmode = layers['blendmode'] || 'softlight';
    //this.filter = layers['filter'] || 'all';
    //this.stroke_color = layers['stroke_color'] || 'black';

    //this.show_flags = layers['show_flags'] || true;
    //this.show_mils = layers['show_mils'] || true;
    //this.show_sites = layers['show_sites'] || true;
    //this.show_unclaimed = layers['show_unclaimed'] || (!Boolean(game.iso));
    this.smartcast = layers['smartcast'] || true;

    color_settings.colorscheme = this.blendmode;
    //gfx.stroke_color = this.stroke_color;
  },
  methods: {
    open: function() {
    },

    // updateLayers: function() {
    //   this.setLayerFilter('countries', this.filter);
    // },

    // setLayerFilter: function(layerName, val) {
    //   gfx.layers[layerName].show.clear();

    //   if (val == 'mine')
    //     gfx.layers[layerName].show.add(game.iso);
    //   else if (val == 'local') {
    //     var firstOrder = client.model.areas.getLocalIsos(game.iso);

    //     for (var firstIso of firstOrder) {
    //       gfx.layers[layerName].show.add(firstIso);

    //       for (var iso of client.model.areas.getLocalIsos(firstIso)) {
    //         gfx.layers[layerName].show.add(iso);
    //       }
    //     }
    //   } else if (val =='hide')
    //     gfx.layers[layerName].show.add('XX');
    // }
  },
  watch: {
    baseLayer: function(val) {
      this.layers['baseLayer'] = val;
      Cookie.set('layers', JSON.stringify(this.layers));

      if (val == 'outline') {
        watercolorLayer.setVisible(false);
        outlineLayer.setVisible(true);
      } else {
        watercolorLayer.setVisible(true);
        outlineLayer.setVisible(false);
      }
    },
    // coloring: function(val) {
    //   this.layers['coloring'] = val;
    //   Cookie.set('layers', JSON.stringify(this.layers));

    //   gfx.coloring = val;
      
    //   //gfx.layers.areas.setVisible(true);
    //   //gfx.layers.countries.setVisible(true);

    //   // country view
    //   gfx.layers.countries_fill.setVisible(true);
    //   gfx.layers.countries.realstroke = false;

    //   gfx.refresh();
    // },
    blendmode: function(val) {
      this.layers['blendmode'] = val;
      Cookie.set('layers', JSON.stringify(this.layers));

      //gfx.stroke_color = val;
      color_settings.colorscheme = val;

      areaLayer.getSource().changed();
    },

    // show_flags: function (val) {
    //   this.layers['show_flags'] = val;
    //   Cookie.set('layers', JSON.stringify(this.layers));

    //   gfx.layers.countries.show_flags = val;

    //   gfx.refresh();
    // },

    // show_mils: function (val) {
    //   this.layers['show_mils'] = val;
    //   Cookie.set('layers', JSON.stringify(this.layers));

    //   gfx.layers.countries.show_mils = val;

    //   gfx.refresh();
    // },

    // show_unclaimed: function (val) {
    //   this.layers['show_unclaimed'] = val;
    //   Cookie.set('layers', JSON.stringify(this.layers));

    //   gfx.layers.countries.show_unclaimed = val;

    //   gfx.refresh();
    // },

    smartcast: function (val) {
      this.layers['smartcast'] = val;
      Cookie.set('layers', JSON.stringify(this.layers));

      keys.smartcast_enabled = val;
    },
  }
});