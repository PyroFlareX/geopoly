import {template} from "/client/gui/infobar/area.vue.js"
import {countries} from '/engine/modules/worlds/world.js';

const ITEM_NAMES = {
  'inf': 'infantry',
  'cav': 'cavalry',
  'art': 'artillery',

  'barr': 'barracks',
  'house': 'house',
  'cita': 'citadel',

  'river': 'river',
  'bridge': 'bridge',
  'forest': 'forest',
  'city': 'settlement',
};


export let component = Vue.component('infobar-area', {
  template: template,

  data: function() {
    return {
      show: false,
      infobar_id: null,
      area: {},
      country: {},
    }
  },

  methods: {
    open: function(area) {
      if (area.getProperties)
        area = area.getProperties();
      this.area = area;
      this.country = countries[area.iso];

      this.infobar_id = 'area-'+area.id;
    },

    item_name: function(n) {
      return ITEM_NAMES[n].title();
    }
  }
});