import {template} from "/js/vue/frame/gameframe.vue.js"
import {match} from '/js/game/store.js';
import {client} from '/js/game/client.js';
import {getGameDate, getGameYear} from '/js/game/lib.js';

const seasons = ['Winter','Spring','Summer','Fall'];
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
    },

    infobar: function(name, ...params) {
      gui.infobar(name, ...params);
    },

    exit: function() {
      if (match.me) {
        let resp = confirm("Are you sure you want to leave the match?");
        
        if (resp)
          client.groups.Matches.request_leave();
      } else {
        Cookie.delete('mid');
        window.location = '/';        
      }
    }
  },

  computed: {
    season: function() {
      let s = this.match.rounds % 4;

      return seasons[s];
    },

    gameyear: function() {
      return getGameYear(this.match.rounds);
    },

    gamedate: function() {
      let {month, day} = getGameDate(this.match.rounds, len(this.match.isos));

      return month + ' ' + day;
    }
  }
});