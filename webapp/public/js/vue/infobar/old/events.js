import {template} from "/js/vue/infobar/events.vue.js";

import {getGameDate, getGameYear, enumname} from '/js/game/lib.js';
import {EVENT, match} from "/js/game/store.js";

export let component = Vue.component('infobar-events', {
  template: template,

  data: function() {
    return {
      show: false,
      entity: null,
      match: match,
    }
  },

  methods: {
    open: function(entity) {
      this.entity = entity;
    },

    getType: function(type) {
      return (enumname(EVENT, type)).title();
    },

    todate: function(event) {
      let {month, day} = getGameDate(event.round, event.np);

      if (match.rounds != event.round) {
        let year = getGameYear(event.round);
        return month + ' ' + day + ', ' + year;
      }

      return month + ' ' + day;
    },

    onClickCoord: function(event) {
      // todo: @later: jumpTo feature
    }
  },
});