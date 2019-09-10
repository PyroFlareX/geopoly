import {_mixins} from '/engine/mixins.js';
import {chat_gui} from '/engine/modules/chat/gui.js';

import {component as areaBuy1} from '/js/gui/infobar/buy-tiles.js';
import {component as areaBuy2} from '/js/gui/infobar/buy-units.js';
import {component as moveInfo} from '/js/gui/infobar/move-info.js';
import {component as countriesInfo} from '/js/gui/infobar/countries.js';

import {component as playersDialog} from '/engine/dialog/players.js';
import {component as settingsDialog} from '/js/gui/dialog/settings.js';
import {component as gameEndDialog} from '/js/gui/dialog/game-end.js';

import {component as countryPopup} from '/js/gui/overlay/overlay-country.js';

import {component as frame} from '/js/gui/frame/gameframe.js';
import {component as flash} from '/js/gui/frame/flash.js';


Vue.mixin({
  
  data: function() {
    return {
      me: null,
      ..._mixins
    };
  }
});

export const template = `
  <game-frame ref="frame"></game-frame>
  <flash ref="flash"></flash>
  <chat-gui room-id="global" id="game-global-chat" ref="global-chat"></chat-gui>

  <dialog-settings @close="quit" ref="dialog-settings"></dialog-settings>
  <dialog-players @close="quit" ref="dialog-players"></dialog-players>
  <dialog-game-end @close="quit" ref="dialog-game-end"></dialog-game-end>

  <infobar-move-info @close="quit" ref="infobar-move-info"></infobar-move-info>
  <infobar-buy-tiles @close="quit" ref="infobar-buy-tiles"></infobar-buy-tiles>
  <infobar-buy-units @close="quit" ref="infobar-buy-units"></infobar-buy-units>
  <infobar-countries @close="quit" ref="infobar-countries"></infobar-countries>

  <overlay-country ref="overlay-country"></overlay-country>
`;
