import {template} from "/js/vue/infobar/move.vue.js"
//import {hideHoverArrow} from '/js/ol/gfx.js';
import {getUnits} from '/js/game/lib.js';

export let component = Vue.component('infobar-move', {
  template: template,

  data: function() {
    return {
      show: false,
      from: {},
      to: {},

      // move patch
      t: 0,
      patch: {}
    }
  },

  methods: {
    open: function(from, to) {
      if (from instanceof ol.Feature) from = from.getProperties();
      if (to instanceof ol.Feature) to = to.getProperties();

      this.from = from;
      this.to = to;

      // set v-model
      for (let u of this.UNITS) {
        this.patch[u] = this.from[u]||0;
      }
    },

    close: function() {
      hideHoverArrow();

      this.show=false;
    },

    onSubmit: function() {
      // quick check
      for (let u of this.UNITS) {
        if (this.patch[u] > this.from[u]||0) {
          return;
        }
      }

      client.groups.Areas.request_move(this.from.id, this.to.id, this.patch);

      this.close();
    },

    toggle: function(u) {
      // toggles 0 to MAX for unit type in input

      if (this.patch[u] > 0)
        this.patch[u] = 0;
      else
        this.patch[u] = this.from[u]||0;

      this.t = Math.random();
    }
  },

  computed: {
    movetype: function() {
      if (this.to.iso == this.from.iso)
        return 'normal';
      else if (getUnits(this.to) == 0)
        return 'conquer';
      else
        return 'battle';
    }
  }
});