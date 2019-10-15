import {template} from "/client/gui/infobar/buy-tiles.vue.js"
import {countries} from '/engine/modules/worlds/world.js';

import {buy_item} from '/client/game/money.js';


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
      buy_item(this.area, item.id);

      this.show = false;
    }
  },

  computed: {
  }
});