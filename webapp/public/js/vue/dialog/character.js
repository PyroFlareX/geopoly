import {template} from "/js/vue/dialog/character.vue.js";

import {get_img, status, onReady} from '/js/autogen.js';


export let component = Vue.component('dialog-character', {
  template: template,

  data: function() {
    return {
      color: [0, 123, 255],

      variable: [0,1,4,5,6,7,8,10,12,13,15],
      weights: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
      highs: [29.909862518310547, 26.26699447631836, 0.0, 0.0, 21.20724105834961, 34.91117477416992, 28.98605728149414, 47.702152252197266, 25.017847061157227, 0.0, 20.986604690551758, 0.0, 18.64076805114746, 35.97879409790039, 0.0, 19.601293563842773],
      lows: [0.00028043612837791443, 0.0, 0.0, 0.0, 0.004125744104385376, 5.576841831207275, 0.0021321214735507965, 23.024473190307617, 2.822951555252075, 0.0, 0.0012453645467758179, 0.0, 0.0, 11.48003101348877, 0.0, 0.004652589559555054],

      status: status,
      updates: 0,

      show: false
    }
  },
  methods: {
    open: function() {
      onReady(() => {
        this.randomize();
      });
    },

    randomize: function() {
      for (let w of range(len(this.weights))) {
        let MIN = this.lows[w];
        let MAX = this.highs[w];

        this.weights[w] = Math.random() * (MAX-MIN) + MIN;
      }

      this.updates += 1;
    },

    hybridize: function() {
      let N = round(Math.random() * 3) + 2;
      let change_i = random.choices(list(range(len(this.weights))), N);

      for (let w of change_i) {
        let change = Math.random() * 5 - 2.5;

        this.weights[w] += change;
      }

      this.updates += 1;
    },

    onSubmit: function() {

      let imgurl = this.src_weights.toString().split(';base64,')[1];

      Cookie.set("imgurl", imgurl);
      window.location = '/home/game';
    }
  },

  computed: {
    src_weights: function() {
      console.log("Generating image", this.updates);

      if (this.status.is_ready)
        return get_img(this.weights, this.color);
      else
        return '';
    }
  }
});
