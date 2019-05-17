import {template} from "/js/vue/infobar/units.vue.js"

export let component = Vue.component('infobar-units', {
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
});