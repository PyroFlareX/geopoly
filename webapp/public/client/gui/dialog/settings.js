import {template} from "/client/gui/dialog/settings.vue.js";

import {color_settings} from "/engine/colors.js";
import {keys} from "/engine/map.js";
import {areaLayer} from '/client/layers/areas.js';

/*
SETTINGS @LATER:
- vastag / normal border
- show flags
- unit style
- base layer??
*/

export let component = Vue.component('dialog-settings', {
  template: template,
  data: function() {
    return {
      show: false,
      settings: {},

      // Settings:
      blendmode: null,
      units3d: null,

      // Boolean:
      smartcast: null,
      thick_borders: null,
      show_flags: null,
    }
  },
  created: function () {
    this.load();

    this.blendmode = this.settings['blendmode'] || 'softlight';
    this.smartcast = this.settings['smartcast'] || true;
    this.show_flags = this.settings['show_flags'] || true;
    this.units3d = this.settings['units3d'] || false;
    this.thick_borders = this.settings['show_flags'] || false;
  },
  methods: {
    open: function() {
    },
    load: function() {
      this.settings = JSON.parse(Cookie.get('settings', '{}'));
    },
    save: function() {
      Cookie.set('settings', JSON.stringify(this.settings));
    }
  },
  watch: {
    blendmode: function(val) {
      this.settings['blendmode'] = val;

      color_settings.colorscheme = val;
      areaLayer.getSource().changed();

      this.save();
    },
    smartcast: function (val) {
      this.settings['smartcast'] = val;

      keys.smartcast_enabled = val;

      this.save();
    },
    units3d: function (val) {
      this.settings['units3d'] = val;

      // todo

      this.save();
    },
    thick_borders: function (val) {
      this.settings['thick_borders'] = val;

      // todo

      this.save();
    },
    show_flags: function (val) {
      this.settings['show_flags'] = val;

      // todo:
      areaLayer.getSource().changed();

      this.save();
    },
  }
});