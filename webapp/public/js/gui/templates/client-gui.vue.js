import {_mixins} from '/engine/mixins.js';
import {chat_gui} from '/engine/modules/chat/gui.js';

import {component as areaBuy1} from '/js/gui/infobar/buy-builds.js';
import {component as areaBuy2} from '/js/gui/infobar/buy-units.js';
//import {component as areaInfo} from '/js/gui/infobar/area-info.js';
import {component as moveInfo} from '/js/gui/infobar/move-info.js';

import {component as playersDialog} from '/engine/dialog/players.js';
import {component as settingsDialog} from '/js/gui/dialog/settings.js';

import {component as frame} from '/js/gui/frame/gameframe.js';


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
  <chat-gui room-id="global" id="game-global-chat" ref="global-chat"></chat-gui>

  <dialog-settings ref="dialog-settings"></dialog-settings>
  <dialog-players ref="dialog-players"></dialog-players>

  <infobar-move-info ref="infobar-move-info"></infobar-move-info>
  <infobar-buy-builds ref="infobar-buy-builds"></infobar-buy-builds>
  <infobar-buy-units ref="infobar-buy-units"></infobar-buy-units>

`;
/*
  <infobar-country ref="infobar-country"></infobar-country>
  <infobar-area ref="infobar-area"></infobar-area>
*/