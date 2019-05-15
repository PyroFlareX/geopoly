import {component as areaInfobar} from '/js/vue/infobar/area.js';
import {component as unitInfobar} from '/js/vue/infobar/unit.js';
import {component as trainingInfobar} from '/js/vue/infobar/training.js';
import {component as buildingInfobar} from '/js/vue/infobar/building.js';
import {component as teamInfobar} from '/js/vue/infobar/team.js';

import {component as settingsDialog} from '/js/vue/dialog/settings.js';
import {component as joinmatchDialog} from '/js/vue/dialog/join-match.js';
import {component as playersDialog} from '/js/vue/dialog/players.js';

import {component as frame} from '/js/vue/frame/gameframe.js';

//import {component as eventsInfobar} from '/js/vue/infobar/events.js';
//  <recommend ref="recommend"></recommend>
//   <infobar-move ref="infobar-move"></infobar-move>
//    <dialog-join-match ref="dialog-join-match"></dialog-join-match>
//    <infobar-events ref="infobar-events"></infobar-events>

export const template = `
  <game-frame ref="frame"></game-frame>

  <dialog-settings ref="dialog-settings"></dialog-settings>
  <dialog-players ref="dialog-players"></dialog-players>

  <infobar-unit ref="infobar-unit"></infobar-unit>
  <infobar-area ref="infobar-area"></infobar-area>
  <infobar-training ref="infobar-training"></infobar-training>
  <infobar-building ref="infobar-building"></infobar-building>
  <infobar-team ref="infobar-team"></infobar-team>
`;