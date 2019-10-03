import {template} from "/client/gui/frame/playtesting.vue.js"

import {maps} from '/client/game/maps.js';

export let component = Vue.component('playtesting', {
  template: template,
  data: function() {
    return {
      show: false,

      users: [],
      users_incl: [],

      maps: maps,
    }
  },
  methods: {
    open: function(users) {
      this.users = users;
      this.show = true;
    },

    onToggle: function(user) {

      if (this.users_incl.includes(user.uid))
        this.users_incl.remove(user.uid);
      else
        this.users_incl.push(user.uid);
    },

    onStart: function() {
      // jah jesus jah jah
      const _uids = this.users_incl.join(',');

      fetch('/playtest/start?uids='+_uids).then((resp)=>{
        return resp.json();
      }).then(({result, no})=>{
        if (result)
          alert("Match Started!");
        else
          alert("Number of users not matching ("+no+")")
      });
    },

    
    onDelete: function() {
      fetch('/playtest/finish').then((resp)=>{
        return resp.json();
      }).then(({result, no})=>{
        if (result)
          alert("Match deleted!");
      });
    },
  },
});