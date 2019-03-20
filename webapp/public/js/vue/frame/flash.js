import {template} from "/js/vue/frame/flash.vue.js"


// Game GUI's main frame
export let component = Vue.component('flash', {
  template: template,
  data: function() {
    return {
      text: null,
      country: null,
      theme: 'danger',
      show: false,
      timeout: null,
    }
  },
  methods: {
    display: function(text, theme, country) {
      if (theme)
        this.theme = theme;
      else
        this.theme = 'white';

      this.text = text;
      this.country = country;
      this.show = true;

      var self = this;

      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }

      this.timeout = setTimeout(function(){
        self.show = false;
        self.text = null;
      }, 4500);
    }
  },
});