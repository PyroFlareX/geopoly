import {template} from "/client/gui/dialog/settings.vue.js";

import {color_settings} from "/engine/colors.js";
import {keys} from "/engine/map.js";
import {areaLayer} from '/client/layers/areas.js';
import {countryLayer} from '/client/layers/countries.js';

import {set_vol} from '/client/game/notifications.js';

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
      save_items: false,
      settings: {},

      // Settings:
      blendmode: null,
      units3d: null,
      volumes: {
        music: 80,chat_msg: 80,action: 80,turns: 80,events: 80
      },

      // Boolean:
      smartcast: null,
      thick_borders: null,
      show_flags: null,

      mute_all: null,
    }
  },
  created: function () {
    this.load();

    this.save_items = false;
    this.blendmode = this.settings['blendmode'] || 'softlight';
    this.smartcast = this.settings['smartcast'] || true;
    this.show_flags = this.settings['show_flags'] || true;
    this.units3d = this.settings['units3d'] || false;
    this.thick_borders = this.settings['show_flags'] || false;
    this.volumes = this.settings['volumes'] || {};

    Vue.nextTick(()=>{
      this.save_items = true;
    });
  },
  methods: {
    open: function() {
    },

    load: function() {
      const c = Cookies['settings'];

      this.settings = JSON.parse(c||'{}');
    },

    save: function() {
      // this flag is used in the beginning, when we load the values
      if (!this.save_items)
        return;

      Cookies.settings = '{"asd": true}';//= JSON.stringify(this.settings);
    }
  },
  watch: {
    blendmode: function(val) {
      this.settings['blendmode'] = val;

      color_settings.colorscheme = val;
      areaLayer.getSource().changed();
      countryLayer.getSource().changed();

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
    mute_all: function (val) {
      this.settings['mute_all'] = val;

      if (val) {
      } else {

      }

      this.save();
    },
    volumes: {
      handler: function(val) {
        this.settings['volumes'] = val;

        set_vol('my_move', parseFloat(val.actions||0));
        set_vol('my_buy', parseFloat(val.actions||0));

        set_vol('my_turn', parseFloat(val.turns||0));
        set_vol('new_turn', parseFloat(val.turns||0));

        set_vol('emperor', parseFloat(val.events||0));
        set_vol('tribute', parseFloat(val.events||0));
        set_vol('surrender', parseFloat(val.events||0));
        set_vol('victory', parseFloat(val.events||0));

        set_vol('chat_msg', parseFloat(val.chat_msg||0));
        set_vol('music', parseFloat(val.music||0));

        this.save();
      },
      deep: true
    }
  }
});