import {template} from "/js/gui/infobar/country.vue.js"
import {ws_client} from '/engine/modules/websocket/wsclient.js';

export let component = Vue.component('infobar-country', {
  template: template,

  data: function() {
    return {
      show: false,
      infobar_id: null,
      
      tribute: 0,

      country: null,
    }
  },

  methods: {
    open: function(country) {
      if (country.getProperties)
        country = country.getProperties();
      this.country = country;

      this.infobar_id = 'country';
    },

    onTribute: function() {

      ws_client.request("Game:tribute", {
        iso: this.country.iso,
        amount: this.tribute
      });

      this.tribute = 0;
    }
  },

  computed: {
  }
});