import {template} from "/js/vue/components/unit-input.vue.js"
 


let units = {};
fetch('/deck/units').then((resp) => {
  return resp.json();
}).then((resp) => {
  units = resp;
});

function getEffectivePoint(u) {
  //  calculate effective points by averaging atts & def, and then measuring from the mean?
  const sdown = 3.6
  let unit = units[u]
  let points = [unit['atk_i'], unit['atk_c'], unit['atk_a'], unit['def']];

  let avg = sum(points) / len(points);
  let mse = 0.5 * points.reduce(function (ss, p) { return ss + Math.pow(p-avg,2); }, 0);

  // special abilities
  if (u == 'inf_skirmish')
      var ov = (1.83 * mse) / sdown;
  else if (u == 'inf_light')
      var ov = 0.055 * getEffectivePoint('inf_heavy');
  else
      var ov = 0;

  return round(mse / sdown + ov);
}


export let component = Vue.component('unit-input', {
  template: template,

  data: function() {
    return {
      show: false,

      decks: {},
      deck_id: '',
      deck_name: '',

      MAX_POINTS: 1000000,
      points: 0,
      patch: {},
      t: 0
    }
  },
  created: function() {
    this.points = 0;

    for (let u of this.UNITS) {
      this.patch[u] = 0;
    }
  },
  methods: {
    toggle: function(u) {
      // toggles 0 to MAX for unit type in input

      if (this.patch[u] > 0)
        this.patch[u] = 0;
      else if(this.deck_id)
        this.patch[u] = this.decks[this.deck_id][u];

      this.t = Math.random();
    },

    onSubmit: function() {
      let formData = new FormData();
      formData.append('name', this.deck_name);

      for (let u of this.UNITS)
        formData.append(u, this.patch[u]);

      fetch("/deck", {
          method: "POST",
          body: formData
      }).then(function(res){ 
        // refresh
        location.reload();
      });
    },

    onDelete: function() {      
      fetch("/deck/"+this.deck_id, {
          method: "DELETE",
      }).then(function(res){ 
        // refresh
        location.reload();
      });
    },

    change: function() {

      this.points = 0;
      
      for (let u of this.UNITS) {
        let num = this.patch[u];
        let ep = getEffectivePoint(u);

        this.points += num * ep;
      }
    }
  },

  watch: {
    deck_id: {
      handler: function(val) {
        if (!this.decks[val]) {
          // reset 
          for (let u of this.UNITS) {
            this.patch[u] = 0;
          }

          this.deck_name = '';
        } else {
          let deck = this.decks[val];

          for (let u of this.UNITS) {
            this.patch[u] = deck[u];
          }

          this.deck_name = deck.name;
        }

        this.t = Math.random();
      },
      immediate: true,
    }
  },

});