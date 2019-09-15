import {template} from "/js/gui/infobar/country.vue.js"

export let component = Vue.component('infobar-country', {
  template: template,

  data: function() {
    return {
      show: false,
      infobar_id: null,
      
      country: null,
    }
  },

  methods: {
    open: function(country) {
      if (country.getProperties)
        country = country.getProperties();
      this.country = country;

      this.infobar_id = 'country';
    }
  },

  computed: {
  }
});