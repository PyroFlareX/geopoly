import {template} from "/js/gui/infobar/move-info.vue.js"

export let component = Vue.component('infobar-move-info', {
  template: template,

  data: function() {
    return {
      show: false,
      infobar_id: null,
      
      act: null,
      area: null,
      to_area: null,
    }
  },

  methods: {
    open: function(area) {
      if (area.getProperties)
        area = area.getProperties();
      this.area = area;

      this.infobar_id = 'move-info';
    },

    set_to: function(area) {
      if (!area) {
        this.to_area = null;
        this.act = null;
        return;
      }
      
      if (area.getProperties)
        area = area.getProperties();
      this.to_area = area;

      if (this.to_area.iso != this.area.iso) {
        if (this.to_area.unit)
          this.act = 'attack';
        else if (this.to_area.tile == 'city')
          this.act = 'capture';
        else
          this.act = 'claim';
      } else {
        this.act = 'move';
      }
    }
  },

  computed: {
  }
});