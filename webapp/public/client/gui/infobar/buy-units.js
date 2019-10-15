import {template} from "/client/gui/infobar/buy-units.vue.js"
import {countries} from '/engine/modules/worlds/world.js';

import {buy_item} from '/client/game/money.js';


export let component = Vue.component('infobar-buy-units', {
  template: template,

  data: function() {
    return {
      show: false,
      infobar_id: null,
      area: {},
      country: {},

      sacrifice: false,
    }
  },

  methods: {
    open: function(area) {
      if (area.getProperties)
        area = area.getProperties();
      this.area = area;
      this.country = countries[area.iso];
      this.sacrifice = false;

      this.infobar_id = 'buy-units-'+area.id;
    },

    onBuy: function(item) {
      if (this.sacrifice) {
        let pick = confirm("This action costs 0 gold, but removes 1 shield from your country! Are you sure?");

        if (!pick)
          return;
      }

      buy_item(this.area, item.id, this.sacrifice || undefined);

      this.sacrifice = false;
      this.show = false;
    }
  },

  computed: {
  }
});