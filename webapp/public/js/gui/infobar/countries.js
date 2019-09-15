import {countries, world} from "/engine/modules/worlds/world.js"
import {template} from "/js/gui/infobar/countries.vue.js"


export let component = Vue.component('infobar-countries', {
  template: template,

  data: function() {
    return {
      show: false,
      infobar_id: null,

      countries: countries,
      world: world,
    }
  },

  methods: {
    open: function(count) {
      this.infobar_id = 'countries';
    },
  },

  computed: {
    max_conquers: function() {
      let _max_conquers = 0;

      for (let iso in countries) {
        if (!_max_conquers || countries[iso].stats.conquers > _max_conquers)
          _max_conquers = countries[iso].stats.conquers;
      }

      return _max_conquers;
    }
  }
});