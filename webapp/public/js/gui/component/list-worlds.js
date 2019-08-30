import {ws_client} from '/engine/modules/websocket/wsclient.js';

import {template} from "/js/gui/component/list-worlds.vue.js"

import {maps} from '/js/game/maps.js';

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
    if (ws_client.connected)
      this.open();
  },
  methods: {
    open: function() {
      ws_client.request("Worlds:list", {}).then(({worlds})=>{
        this.show = true;

        this.worlds = worlds;
      });
    },

    close: function() {
      this.show = false;
    }
  },
});