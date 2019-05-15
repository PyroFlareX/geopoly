import {template} from "/js/vue/infobar/building.vue.js"

export let component = Vue.component('infobar-building', {
  template: template,

  data: function() {
    return {
      show: false,
      area: {},
    }
  },

  methods: {
    open: function(area) {
      if (area instanceof ol.Feature)
        area = area.getProperties();

      this.area = area;
    },
  },
});