import {template} from "/js/gui/overlay/overlay-country.vue.js"


export let component = Vue.component('overlay-country', {
  template: template,
  data: function() {
    return {
      show: false,
      country: {},
    }
  },
  methods: {
    open: function(country) {
      if (country.getProperties)
        country = country.getProperties();

      this.show = true;
      this.country = country;
    }
  }
});
