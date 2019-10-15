import {client} from '/client/websocket.js';

import {template} from "/client/gui/component/list-worlds.vue.js"

import {maps} from '/client/game/maps.js';

export let component = Vue.component('list-worlds', {
  template: template,
  data: function() {
    return {
      show: false,

      worlds: [],
      maps: maps
    }
  },
  created: function() {
    if (client.ws.connected)
      this.open();
  },
  methods: {
    open: function() {
      client.ws.request("Worlds:list", {}).then(({worlds})=>{
        this.show = true;

        this.worlds = worlds;
      });
    },

    close: function() {
      this.show = false;
    }
  },
});