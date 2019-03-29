import {template} from "/js/vue/dialog/join-match.vue.js";
import {client} from '/js/game/client.js';
import {countries, decks} from '/js/game/store.js';


export let component = Vue.component('dialog-join-match', {
  template: template,
  data: function() {
    return {
      show: false,

      country: {},
      area: {
        name: null,
        id: null
      },
      match: {
        mid: null,
        isos: [],
      },
      decks: decks,
      deck: null,

      username: '',
      iso: null,
    }
  },
  methods: {
    open: function(match, iso, area_id, area_name) {
      this.match = match;
      this.area.id = area_id;
      this.area.name = area_name;
      this.country = countries[iso];
      this.iso = iso;
      this.username = Cookie.get('username', '');
    },

    onSubmit: function() {
      client.groups.Matches.request_join(this.match.mid, this.iso, this.username, this.area.id, this.deck);

      this.show = false;
    }
  }
});