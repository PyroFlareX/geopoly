import {template} from "/js/vue/infobar/country.vue.js"

export let component = Vue.component('infobar-country', {
  template: template,

  data: function() {
    return {
      show: false,
      country: {},
    }
  },

  methods: {
    open: function(country) {
      if (country instanceof ol.Feature)
        country = country.getProperties();

      this.country = country;
    },

    infobar_id: function() {
      return 'country_' + this.country.id;
    }
  },
});