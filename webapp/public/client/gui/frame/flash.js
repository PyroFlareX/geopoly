import {template} from "/client/gui/frame/flash.vue.js"


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

      if (this.timeout) {
        // disable previous timeout as a new message has popped (and the old one was cleared anyway)
        clearTimeout(this.timeout);
        this.timeout = null;
      }

      // clear the message after a while
      this.timeout = setTimeout(()=>{
        this.show = false;
        this.text = null;
      }, 7500);
    }
  },
});