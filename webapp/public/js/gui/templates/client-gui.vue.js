import {_mixins} from '/engine/mixins.js';

Vue.mixin({
  
  data: function() {
    return {
      me: null,
      ..._mixins
    };
  }
});

//import {component as countryInfobar} from '/js/gui/infobar/country.js';

import {component as playersDialog} from '/engine/dialog/players.js';
import {component as settingsDialog} from '/js/gui/dialog/settings.js';

import {component as frame} from '/js/gui/frame/gameframe.js';


export const template = `
  <game-frame ref="frame"></game-frame>

  <dialog-settings ref="dialog-settings"></dialog-settings>
  <dialog-players ref="dialog-players"></dialog-players>
`;
/*
  <infobar-unit ref="infobar-unit"></infobar-unit>
  <infobar-country ref="infobar-country"></infobar-country>
  <infobar-area ref="infobar-area"></infobar-area>
  <infobar-training ref="infobar-training"></infobar-training>
  <infobar-building ref="infobar-building"></infobar-building>
  <infobar-team ref="infobar-team"></infobar-team>
  <infobar-units ref="infobar-units"></infobar-units>
*/