import {template} from "/js/vue/dialog/create-match.vue.js";
import {client} from '/js/game/client.js';


export let component = Vue.component('dialog-create-match', {
  template: template,
  data: function() {
    return {
      show: false,

      players: {
        1: 18
      },

      max_rounds: 90,
      map: 1,

    }
  },
  created: function () {
  },
  methods: {
    open: function() {
      
    },

    onSubmit: function() {
      client.groups.Matches.request_create(this.map, this.players[this.map], this.max_rounds);

      this.show = false;
    }
  }
});