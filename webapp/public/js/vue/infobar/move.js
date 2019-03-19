import {template} from "/js/vue/infobar/move.vue.js"

export let component = Vue.component('infobar-move', {
  template: template,

  data: function() {
    return {
      show: false,
      from: {},
      to: {}
    }
  },

  methods: {
    open: function(from, to) {
      if (from instanceof ol.Feature) from = from.getProperties();
      if (to instanceof ol.Feature) to = to.getProperties();

      this.from = from;
      this.to = to;
    },
  },

  computed: {
    rnd: function() {
      return time();
    }
  }
});