import {world,countries} from '/engine/modules/worlds/world.js'
import {template} from "/client/gui/dialog/game-end.vue.js"


export let component = Vue.component('dialog-game-end', {
  template: template,

  data: function() {
    return {
      show: false,
      winner: null,

      world: world,
      countries: countries
    }
  },

  methods: {
    open: function(winner) {
      this.show = true;
      this.winner = winner;
    },

    close: function() {
      this.show = false;
    },

    onClick: function() {
      window.location = '/';
    }
  }
});
