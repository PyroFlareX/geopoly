import {} from "/js/vue/mixins.js";

export const gui = new Vue({
  el: '#app-gui',
  data: {
    opened_comp: null,
    opened: null,
  },
  methods: {
    child: function(name) {
      return this.$refs[name];
    },

    infobar: function(name, ...params) {
      if (this.opened_comp) {
        this.opened_comp.show = false;
        this.opened = null;
      }

      let child = this.$refs['infobar-'+name];

      if (!child) return;

      child.open(...params);
      child.show = true;
      this.opened_comp = child;
      this.opened = child.infobar_id;

      return child;
    },

    dialog: function(name, ...params) {
      if (this.opened_comp) {
        this.opened_comp.show = false;
        this.opened = null;
      }

      let child = this.$refs['dialog-'+name];

      if (!child) return;

      child.open(...params);
      child.show = true;
      this.opened_comp = child;
      this.opened = name;

      return child;
    },

    overlay: function(name, ...params) {
      if (this.opened_comp) {
        this.opened_comp.show = false;
        this.opened = null;
      }

      let child = this.$refs['overlay-'+name];

      if (!child) return;

      child.open(...params);
      child.show = true;
      this.opened_comp = child;
      this.opened = name;

      return child;
    },

    flash: function(text, theme, iso) {
      this.$refs.flash.display(text, theme, iso);
    }
  },
  computed: {
    frame: function() {
      return this.$refs.frame;
    }
  }
});
