import {maps} from '/js/game/maps.js';
import {switch_map} from '/js/gui/other/minimap.js';

import {template} from "/js/gui/component/world-hall.vue.js"


export let component = Vue.component('world-hall', {
  template: template,
  data: function() {
    return {
      show: false,

      world: null,
      map: null
    }
  },
  methods: {

    open: function(world) {
      this.world = world;

      Vue.nextTick(() => {
        this.set_map(this.world.map);
      });

      this.show = true;
    },

    close: function() {
      this.show = false;
    },

    add_player: function(user) {
      if (this.world)
        this.world.players[user.iso] = user;
    },

    remove_player: function(iso) {
      delete this.world.players[iso];
    },

    onSetMap: function(map_id) {
      this.$emit('setmap', this.world.wid, map_id);

      this.set_map(map_id);
    },

    set_map: function(map_id) {
      this.world.map = map_id;
      this.map = maps[map_id];

      switch_map(map_id);
    },

    onClickMap: function() {
      gui.dialog('map-select', this.set_map);
    }
  }
});