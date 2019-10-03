import {template} from "/client/gui/infobar/buy-tiles.vue.js"
import {ws_client} from '/engine/modules/websocket/wsclient.js';
import {countries} from '/engine/modules/worlds/world.js';


export let component = Vue.component('infobar-buy-tiles', {
  template: template,

  data: function() {
    return {
      show: false,
      infobar_id: null,
      area: {},
      country: {},
    }
  },

  methods: {
    open: function(area) {
      if (area.getProperties)
        area = area.getProperties();
      this.area = area;
      this.country = countries[area.iso];

      this.infobar_id = 'buy-tiles-'+area.id;
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