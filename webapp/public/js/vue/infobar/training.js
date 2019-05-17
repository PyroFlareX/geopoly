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
      if (area.getProperties)
        area = area.getProperties();

      this.area = area;
    },

    onSetTraining: function(unit) {
      this.area.training = unit.type;
      this.area.train_left = unit.train_turns;

      client.controllers.Areas.request_training(this.area.id, this.area.training);
    },

    onClearTraining: function() {
      this.area.training = null;

      client.controllers.Areas.request_training(this.area.id, this.area.training);
    },

    infobar_id: function() {
      return 'training_' + this.area.id;
    }
  },
});