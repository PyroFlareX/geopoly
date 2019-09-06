import {template} from "/js/gui/infobar/buy-builds.vue.js"
import {ws_client} from '/engine/modules/websocket/wsclient.js';


export let component = Vue.component('infobar-buy-builds', {
  template: template,

  data: function() {
    return {
      show: false,
      infobar_id: null,
      area: {},
      world: {},
    }
  },

  methods: {
    open: function(area, world) {
      if (area.getProperties)
        area = area.getProperties();
      this.area = area;
      this.world = world;

      this.infobar_id = 'buy-builds-'+area.id;
    },

    onBuy: function(item) {
      ws_client.request("Game:buy", {
        area_id: this.area.id,
        item_id: item.id,
      });

      this.show = false;
    }
  },

  computed: {
  }
});