import {template} from "/js/vue/dialog/country-picker.vue.js"

let countries = {};
const data = {
  show: false,
  select: null,
  
  countries: countries
};

export let component = Vue.component('dialog-country-picker', {
  template: template,

  data: function() {
    return data
  },

  methods: {
    open: function() {

    },

    onClicked: function(iso) {
      this.select = iso;

      Cookie.set('iso', iso);
      Cookie.set('country_name', this.countries[iso].name);

      this.$emit('picked', this.countries[iso]);

      this.show = false;
    }
  }
});


fetch('/json/countries.json', {cache: 'force-cache'}).then((resp) => {
  return resp.json();
}).then((resp) => {
  data.countries = resp;

  for (let [k, country] of Object.items(data.countries)) {
    country.iso = k;
  }
});