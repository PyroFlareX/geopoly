import {ws_client} from '/engine/modules/websocket/wsclient.js';

import {template} from "/js/gui/component/matchmaking.vue.js"

import {maps} from '/js/game/maps.js';

export let component = Vue.component('matchmaking', {
  template: template,
  data: function() {
    return {
      show: false,

      worlds: [],
      maps: maps
    }
  },
  created: function() {
  },
  methods: {
    open: function() {
      this.$refs['list-worlds'].open();

      ws_client.on("Worlds:joined", ({user})=>{
        this.$refs['world-hall'].add_player(user);
      });

      ws_client.on("Worlds:left", ({iso})=>{
        this.$refs['world-hall'].remove_player(iso);
      });

      ws_client.on("Worlds:edit", ({patch})=>{
        if (patch.map)
          this.$refs['world-hall'].set_map(patch.map);
      });
    },

    onJoin: function(world, iso) {
      ws_client.request("Worlds:join", {wid: world.wid, iso: iso}).then(({world, user})=>{
        this.$refs['list-worlds'].close();

        this.$refs['world-hall'].open(world);
        this.$refs['world-hall'].add_player(user);
      });
    },

    onLeave: function() {
      ws_client.request("Worlds:leave", {}).then(()=>{
        this.$refs['list-worlds'].open();
        this.$refs['world-hall'].close();
      });
    },
    
    onCreate: function(world) {
      ws_client.request("Worlds:create", {}).then(({world})=>{
        this.onJoin(world, []);
      });
    },

    onSwitch: function(wid, iso) {
      ws_client.request("Worlds:leave", {}).then(()=>{
        // todo: temporal solution
        this.onJoin({wid: wid}, iso);
      });
    },

    onStart: function() {

    },

    setMap: function(wid, map_id) {
      ws_client.request("Worlds:edit", {patch:{wid: wid, map: map_id}}).then(()=>{

      });
    },

  },
});