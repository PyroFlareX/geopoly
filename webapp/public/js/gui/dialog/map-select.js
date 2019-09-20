import {template} from "/js/gui/dialog/map-select.vue.js"
import {maps} from '/js/game/maps.js';


export let component = Vue.component('dialog-map-select', {
  template: template,

  data: function() {
    return {
      show: false,
      call: null,
      maps: maps
    }
  },

  methods: {
    open: function(call) {
      this.show = true;
      this.call = call;
    },

    close: function() {
      this.show = false;
    },

    onSelect: function(map_id) {
      this.call(map_id);

      this.close();
    }
  }
});
