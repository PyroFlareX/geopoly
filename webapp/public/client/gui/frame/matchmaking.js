import {client} from '/client/websocket.js';

import {template} from "/client/gui/frame/matchmaking.vue.js"

import {maps} from '/client/game/maps.js';

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
    open: function(wid_join) {
      this.$refs['list-worlds'].open();

      client.ws.on("Worlds:joined", ({user})=>{
        this.$refs['world-hall'].add_player(user);
      });

      client.ws.on("Worlds:left", ({iso})=>{
        this.$refs['world-hall'].remove_player(iso);
      });

      client.ws.on("Worlds:edit", ({patch})=>{
        if (patch.map)
          this.$refs['world-hall'].set_map(patch.map);
      });

      if (wid_join) {
        // automatically reconnect to our world
        this.onJoin({wid: wid_join}, null);
      }
    },

    onJoin: function(world, iso) {
      client.ws.request("Worlds:join", {wid: world.wid, iso: iso}).then(({world, user})=>{
        this.$refs['list-worlds'].close();

        this.$refs['world-hall'].open(world);
        this.$refs['world-hall'].add_player(user);
      });
    },

    onLeave: function() {
      client.ws.request("Worlds:leave", {}).then(()=>{
        this.$refs['list-worlds'].open();
        this.$refs['world-hall'].close();
      });
    },
    
    onCreate: function() {
      client.ws.request("Worlds:create", {}).then(({world})=>{
        this.onJoin(world, []);
      });
    },

    onSwitch: function(wid, iso) {
      client.ws.request("Worlds:leave", {}).then(()=>{
        // todo: temporal solution
        this.onJoin({wid: wid}, iso);
      });
    },

    onStart: function() {

    },

    setMap: function(wid, map_id) {
      client.ws.request("Worlds:edit", {patch:{wid: wid, map: map_id}}).then(()=>{

      });
    },

  },
});