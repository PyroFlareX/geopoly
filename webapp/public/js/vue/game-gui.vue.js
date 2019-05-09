import {component as moveInfobar} from '/js/vue/infobar/move.js';
import {component as areaInfobar} from '/js/vue/infobar/area.js';
import {component as eventsInfobar} from '/js/vue/infobar/events.js';

import {component as settingsDialog} from '/js/vue/dialog/settings.js';
import {component as joinmatchDialog} from '/js/vue/dialog/join-match.js';
import {component as playersDialog} from '/js/vue/dialog/players.js';

import {component as frame} from '/js/vue/frame/gameframe.js';
//  <recommend ref="recommend"></recommend>
//   <infobar-move ref="infobar-move"></infobar-move>

//    <dialog-join-match ref="dialog-join-match"></dialog-join-match>

//    <infobar-events ref="infobar-events"></infobar-events>

export const template = `
  <game-frame ref="frame"></game-frame>

  <dialog-settings ref="dialog-settings"></dialog-settings>
  <dialog-players ref="dialog-players"></dialog-players>

  <infobar-area ref="infobar-area"></infobar-area>
`;