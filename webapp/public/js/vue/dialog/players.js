import {template} from "/js/vue/dialog/players.vue.js";
import {countries} from "/js/game/store.js";

export let component = Vue.component('dialog-players', {
  template: template,
  data: function() {
    return {
      show: false,

      countries: countries,
    }
  },
  created: function () {
  },
  methods: {
    open: function() {
      
    },

    onClicked: function() {
      
    }
  }
});