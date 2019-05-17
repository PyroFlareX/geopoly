import {template} from "/js/vue/infobar/area.vue.js"
import {countries} from "/js/game/store.js";

export let component = Vue.component('infobar-area', {
  template: template,

  data: function() {
    return {
      show: false,
      area: {},
    }
  },

  methods: {
    open: function(area) {
      if (area.getProperties)
        area = area.getProperties();

      this.area = area;
    },
  },

  computed: {
    country: function() {
      return countries[this.area.iso];
    },

    infobar_id: function() {
      return 'area_' + this.area.id;
    }
  }
});