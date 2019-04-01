import {} from "/js/vue/mixins.js";

export const gui = new Vue({
  el: '#app-gui',
  data: {
    opened: null
  },
  methods: {
    child: function(name) {
      return this.$refs[name];
    },

    infobar: function(name, ...params) {
      if (this.opened)
        this.opened.show = false;

      let child = this.$refs['infobar-'+name];

      if (!child) return;

      child.open(...params);
      child.show = true;
      this.opened = child;

      return child;
    },

    dialog: function(name, ...params) {
      if (this.opened)
        this.opened.show = false;

      let child = this.$refs['dialog-'+name];

      if (!child) return;

      child.open(...params);
      child.show = true;
      this.opened = child;

      return child;
    },

    overlay: function(name, ...params) {
      if (this.opened)
        this.opened.show = false;

      let child = this.$refs['overlay-'+name];

      if (!child) return;

      child.open(...params);
      child.show = true;
      this.opened = child;

      return child;
    },

    flash: function(text, theme, iso) {
      this.$refs.flash.display(text, theme, iso);
    }
  }
});
