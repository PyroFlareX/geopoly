import {template} from "/js/vue/infobar/training.vue.js"

export let component = Vue.component('infobar-training', {
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

    onSetTraining: function(unit) {
      this.area.training = unit.type;
      this.area.train_left = unit.train_turns;

      console.log("TODO: send rq")
    },

    onClearTraining: function() {
      this.area.training = null;

      console.log("TODO: send rq")
    },

  },
});