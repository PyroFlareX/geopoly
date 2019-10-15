import {template} from "/client/gui/infobar/country.vue.js"
import {client} from '/js/websocket.js';

export let component = Vue.component('infobar-country', {
  template: template,

  data: function() {
    return {
      show: false,
      infobar_id: null,
      dragging: false,
      
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

      client.ws.request("Game:tribute", {
        iso: this.country.iso,
        amount: this.tribute
      });

      this.tribute = 0;
    },
  },

  computed: {
  }
});