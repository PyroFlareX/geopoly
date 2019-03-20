import {template} from "/js/vue/frame/gameframe.vue.js"


// Game GUI's main frame
export let component = Vue.component('game-frame', {
  template: template,
  data: function() {
    return {
      country: {
        iso: "AA",
        name: "",
        color: new Color("black")
      },
      username: "",

      // todo: timestart
    }
  },

  methods: {
    onClickFlag: function() {
      gfx.jumpToMe();
    },
  },

  computed: {
  }
});