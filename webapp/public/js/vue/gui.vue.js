import {component as moveInfobar} from '/js/vue/infobar/move.js';
import {component as areaInfobar} from '/js/vue/infobar/area.js';

import {component as settingsDialog} from '/js/vue/dialog/settings.js';
import {component as playersDialog} from '/js/vue/dialog/players.js';

import {component as frame} from '/js/vue/frame/gameframe.js';

export const template = `
  <game-frame ref="frame"></game-frame>

  <dialog-settings ref="dialog-settings"></dialog-settings>
  <dialog-players ref="dialog-players"></dialog-players>

  <infobar-area ref="infobar-area"></infobar-area>
  <infobar-move ref="infobar-move"></infobar-move>

`;