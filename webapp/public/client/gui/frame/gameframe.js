import {world} from '/engine/modules/worlds/world.js';
import {ws_client} from '/engine/modules/websocket/wsclient.js';
import {openRandom} from '/engine/gfx/jumpto.js';
import {getColor, colors} from '/engine/colors.js';
import {maps} from '/client/game/maps.js';

import {template} from "/client/gui/frame/gameframe.vue.js"

import {end_turn} from '/client/game/turns.js';


function random_day(turns, mo) {
  // gets random day of month
  const m = 0x80000000; // 2**31;
  const a = 1103515245;
  const c = 12345;

  let state = turns ? turns : Math.floor(Math.random() * (m-1));
  state = (a * state + c) % m;
  state /= (m -1);
  
  return round(state)*(mo == 2 ? 30 : 28);
}


// Game GUI's main frame
export let component = Vue.component('game-frame', {
  template: template,
  data: function() {
    return {
      iso: "AA",
      world: world,

      turn_time_left: null,
      updates: 0,
    }
  },

  methods: {
    onClickFlag: function(e) {
      openRandom();
    },

    onClickSeason: function(e) {
      this.turn_time_left = null;
      
      end_turn();
    },

    setTurnTimeout(ticks) {
      this.turn_time_left = ticks;

      // force update
      this.$forceUpdate();
    },

    exit: function() {
      if (this.world.me) {
        let resp = confirm("Are you sure you want to leave the world?");
        
        if (resp)
          ws_client.request("Game:surrender", {
          }).then(()=>{
            window.location = '/';
          });

      } else {
        window.location = '/';
      }
    }
  },

  computed: {

    season: function() {
      let m = this.world.turns % 12 + 1;

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
      let start_year = maps[this.world.map].year;
      let dy = Math.floor(this.world.turns / 12);

      return start_year + dy;
    },

    gamedate: function() {
      let y = this.gameyear;
      let m = this.world.turns % 12 + 1;

      let d = random_day(this.world.turns);

      m = ('0' + m).slice(-2);
      d = ('0' + d).slice(-2);

      let t_beg = new Date(y+"-"+m+"-"+d+"T01:00:00");
      
      let month = t_beg.toLocaleString("en-US", { month: "short" });
      let day = t_beg.getDate();

      return month + ' ' + day;
    }
  }
});