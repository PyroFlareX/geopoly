import {template} from "/js/vue/frame/gameframe.vue.js"
import {match} from '/js/game/store.js';

const start_year = 1831;
const seasons = ['Winter','Spring','Summer','Fall'];
const season_months = [
  ['12','02'],
  ['03','05'],
  ['06','08'],
  ['09', '11']
];
/*
  1 match is ~120 rounds
  if 1 round is 1 season, 
  then that's /4 = 30 years overall

  so 1 round is 3 months
  then 1 turn is ~2 weeks
*/


// Game GUI's main frame
export let component = Vue.component('game-frame', {
  template: template,
  data: function() {
    return {
      iso: "AA",

      match: match,
      username: "",

      updates: 0,
    }
  },

  methods: {
    onClickFlag: function(e) {
      //gfx.jumpToMe();
      console.error("TODO: jumpToMe")
    },

    onClickSeason: function(e) {
      // end turn papa

      client.groups.Matches.request_end_turn();
    },

    dialog: function(name, ...params) {
      gui.dialog(name, ...params);
    }
  },

  computed: {
    season: function() {
      let s = this.match.rounds % 4;

      return seasons[s];
    },

    gameyear: function() {
      let dy = Math.floor(this.match.rounds / 4);

      return start_year + dy;
    },

    gamedate: function() {
      // get season & number of players:
      let s = this.match.rounds % 4;
      let num_players = len(this.match.isos);

      // get the year, when the season ends and begins in
      let year_beg = this.gameyear;
      let year_end = s == 0 ? year_beg+1 : year_beg;

      // get first and last month of season
      let [month_beg, month_end] = season_months[s];

      // date range for whole season:
      let t_beg = new Date(year_beg+"-"+month_beg+"-01T01:00:00");
      let t_end = new Date(year_end+"-"+month_end+"-28T23:00:00");

      if (num_players == 0) {
        // return first date
        var now = t_beg;
      } else {
        // this many in-game seconds per player turn:
        let dt_per_turn = ((t_end.getTime() - t_beg.getTime()) / 1000) / num_players;

        let pos = match.isos.indexOf(match.current);
        
        // return a random offset, using player's position in the queue
        let dt = (Math.random() * dt_per_turn) + dt_per_turn*pos;

        var now = t_beg;
        now.setSeconds(now.getSeconds() + dt);
      }

      var mm = now.toLocaleString("en-US", { month: "short" });

      return mm + ' ' + now.getDate();
    }
  }
});