import {template} from "/js/vue/frame/flash.vue.js"


// Game GUI's main frame
export let component = Vue.component('flash', {
  template: template,
  data: function() {
    return {
      show: false,

      iso: null,
      theme: 'danger',
      text: null,
      timeout: null,
    }
  },
  methods: {
    display: function(text, theme, iso) {
      if (theme)
        this.theme = theme;
      else
        this.theme = 'white';

      this.text = text;
      this.iso = iso;
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