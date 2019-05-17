import {template} from "/js/vue/infobar/unit.vue.js"
import {get_img, status, onReady} from '/js/game/autogen.js';
import {getColor, colors} from '/js/game/colors.js';
import {countries} from "/js/game/store.js";


export let component = Vue.component('infobar-unit', {
  template: template,

  data: function() {
    return {
      show: false,

      status: status,

      unit: {},
    }
  },

  methods: {
    open: function(unit) {
      if (unit.getProperties)
        unit = unit.getProperties();

      this.unit = unit;
    },
  },
  computed: {
    country: function() {
      return countries[this.unit.iso];
    },

    src_unit: function() {
      if (!this.status.is_ready)
        return '';

      let weights = this.unit.img_vector;
      
      let bgcolor = getColor(this.unit), i = 0;
      while (bgcolor.contrast() == 'black' && i < 8)
        bgcolor = bgcolor.shade(-0.15);

      let color = colors.WHITE;

      return get_img(weights, color, bgcolor);
    },


    infobar_id: function() {
      return 'unit_' + this.unit.id;
    }
  }
});