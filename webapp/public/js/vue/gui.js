import {} from "/js/vue/mixins.js";
import {template} from "/js/vue/gui.vue.js";

$("#app-gui").innerHTML = template;

export const gui = new Vue({
  el: '#app-gui',
  data: {

  },
  methods: {
    child: function(name) {
      return this.$refs[name];
    },

    infobar: function(name, ...params) {
      let child = this.$refs['infobar-'+name];

      child.open(...params);
      child.show = true;
      return child;
    },

    dialog: function(name, ...params) {
      let child = this.$refs['dialog-'+name].open(params);

      child.open(...params);
      child.show = true;
      return child;
    },

    overlay: function(name, ...params) {
      let child = this.$refs['overlay-'+name];

      child.open(...params);
      child.show = true;
      return child;
    },

    flash: function(text, theme, country) {
      this.$refs.flash.display(text, theme, country);
    }
  }
});
