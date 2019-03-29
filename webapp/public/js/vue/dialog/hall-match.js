import {template} from "/js/vue/dialog/hall-match.vue.js";
import {client} from '/js/game/client.js';


export let component = Vue.component('dialog-hall-match', {
  template: template,
  data: function() {
    return {
      show: false,
    }
  },
  created: function () {
  },
  methods: {
    open: function() {
      
    },

    onSubmit: function() {

      this.show = false;
    }
  }
});