import {template} from "/js/vue/infobar/team.vue.js"

export let component = Vue.component('infobar-team', {
  template: template,

  data: function() {
    return {
      show: false,
      show_tooltip: false,
      
      area: {},
    }
  },

  methods: {
    open: function(area) {
      if (area.getProperties)
        area = area.getProperties();

      this.area = area;
    },

    onShiftFort: function() {
      let LF = len(this.units_in);
      let LT = len(this.units_out);

      if (LF >= 9)
        return;

      for (let i=LT-1; i>=LT-(9-LF); i--) {
        this.units_out[i].set('role', 'garrison');
      }
    },

    onShiftTeam: function() {
      let LF = len(this.units_in);
      let LT = len(this.units_out);

      if (LT >= 9)
        return;

      for (let i=LF-1; i>=LF-(9-LT); i--) {
        this.units_in[i].set('role', 'team');
      }
    },

    switchTeam: function(unit) {
      if (unit.get('role') == 'garrison') {
        if (len(this.units_out) < 9) {
          unit.set('role', 'team');
        }
      } else {
        if (len(this.units_in) < 9) {
          unit.set('role', 'garrison');
        }
      }
    }
  },

  computed: {
    units_in: function() {
      return this.area.units.filter(unit => unit.get('role') == 'garrison');
    },

    units_out: function() {
      return this.area.units.filter(unit => unit.get('role') == 'team');
    },

    infobar_id: function() {
      return 'team_' + this.area.id;
    }
  }
});