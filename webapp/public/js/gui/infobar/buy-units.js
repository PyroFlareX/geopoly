import {template} from "/js/gui/infobar/buy-units.vue.js"

export let component = Vue.component('infobar-buy-units', {
  template: template,

  data: function() {
    return {
      show: false,
      infobar_id: null,
      area: {},
      world: {},
    }
  },

  methods: {
    open: function(area, world) {
      if (area.getProperties)
        area = area.getProperties();
      this.area = area;
      this.world = world;

      this.infobar_id = 'buy-units-'+area.id;
    },
  },

  computed: {
  }
});