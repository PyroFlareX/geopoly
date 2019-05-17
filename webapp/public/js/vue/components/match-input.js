import {template} from "/js/vue/components/match-input.vue.js"
import {WorldsController} from "/js/game/controllers/worlds.js";

const worldsController = new WorldsController({});

export let component = Vue.component('match-input', {
  template: template,

  data: function() {
    return {
      // picked iso
      iso: '',
      country_name: '',

      // picked character
      name: '',
      age: 0,
      weights: null,

      // this is a cached version of what the character creation does
      img_src: '/img/gui/blankface.png',
    }
  },

  created: function() {
    this.name = Cookie.get('name', 'Select character');
    this.age = Cookie.get('age', 25);
    this.weights = Cookie.get('weights', [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]);

    this.iso = Cookie.get('iso', 'AA');
    this.country_name = Cookie.get('country_name', 'Select country');

    if (Cookie.get('imgurl'))
      this.img_src = 'data:image/png;base64,' + Cookie.get('imgurl');
  },

  methods: {
    onSubmit: function() {
      
      worldsController.request_find(this.iso, this.name, this.age, this.weights);
    },

    editCountry: function() {
      gui.dialog('country-picker');
    },

    editProfile: function() {
      gui.dialog('character');
    },

    setCountry: function(country) {
      this.iso = country.iso;
      this.country_name = country.name;
    },

    setCharacter: function(hero) {
      this.weights = hero.weights;
      this.img_src = hero.img_src;
      this.name = hero.name;
    },
  }
});