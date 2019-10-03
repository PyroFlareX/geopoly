import '/engine/gui/infobar-header.js';
import '/engine/modules/chat/gui.js';
import '/engine/dialog/players.js';

import '/client/gui/infobar/countries.js';
import '/client/gui/infobar/country.js';
import '/client/gui/infobar/area.js';
import '/client/gui/infobar/buy-tiles.js';
import '/client/gui/infobar/buy-units.js';

import '/client/gui/dialog/settings.js';
import '/client/gui/dialog/game-end.js';
import '/client/gui/dialog/disconnect.js';

import '/client/gui/overlay/overlay-country.js';
import '/client/gui/frame/gameframe.js';
import '/client/gui/frame/flash.js';

import {_mixins} from '/engine/mixins.js';
import {gui as argentina_colombia} from '/engine/gui.js';


Vue.mixin({
  
  data: function() {
    return {
      me: null,
      ..._mixins
    };
  }
});


// https://www.youtube.com/watch?v=xoLmeOBn4ck
export const gui = argentina_colombia;
