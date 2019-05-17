import {template} from "/js/vue/frame/gameframe.vue.js"
import {match} from '/js/game/store.js';
import {client} from '/js/game/client.js';
import {openRandom} from '/js/ol/areas.js';
import {get_img, status, onReady} from '/js/game/autogen.js';
import {getColor, colors} from '/js/game/colors.js';
import {SRNG} from '/js/vendor/srng.js';


// Game GUI's main frame
export let component = Vue.component('game-frame', {
  template: template,
  data: function() {
    return {
      iso: "AA",
      match: match,
      username: "",

      team: null,

      status: status,
      updates: 0,
    }
  },

  methods: {
    onClickFlag: function(e) {
      openRandom();
    },

    onClickSeason: function(e) {
      // end turn papa

      client.controllers.Matches.request_end_turn();
    },

    src_unit: function(unit) {
      if (!this.status.is_ready)
        return '';

      let weights = unit.get('img_vector');
      
      let bgcolor = getColor(unit), i = 0;
      while (bgcolor.contrast() == 'black' && i < 8)
        bgcolor = bgcolor.shade(-0.15);

      let color = colors.WHITE;

      // if (color.contrast() == 'black') {
      //   let _c = color;
      //   color = bgcolor;
      //   bgcolor = _c;
      // }

      return get_img(weights, color, bgcolor);
    },

    exit: function() {
      if (this.match.me) {
        let resp = confirm("Are you sure you want to leave the match?");
        
        if (resp)
          client.controllers.Matches.request_leave();
      } else {
        Cookie.delete('mid');
        window.location = '/';        
      }
    }
  },

  computed: {

    season: function() {
      let m = this.match.turns % 12 + 1;

      if (m <= 2 || m == 12)
        return 'Winter';
      else if (3 <= m && m <= 5)
        return 'Spring';
      else if (6 <= m && m <= 8)
        return 'Summer';
      else if (9 <= m && m <= 11)
        return 'Fall';
      return 'Rawr XD';
    },

    gameyear: function() {
      const start_year = 1348;
      let dy = Math.floor(this.match.turns / 12);

      return start_year + dy;
    },

    gamedate: function() {
      let y = this.gameyear;
      let m = this.match.turns % 12 + 1;
      let d = round((new SRNG(this.match.turns)).random()*(m == 2 ? 30 : 28));

      m = ('0' + m).slice(-2);
      d = ('0' + d).slice(-2);

      let t_beg = new Date(y+"-"+m+"-"+d+"T01:00:00");
      
      let month = t_beg.toLocaleString("en-US", { month: "short" });
      let day = t_beg.getDate();

      return month + ' ' + day;
    }
  }
});