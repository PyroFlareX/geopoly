import {component as moveInfobar} from '/js/vue/infobar/move.js';
import {component as areaInfobar} from '/js/vue/infobar/area.js';
import {component as frame} from '/js/vue/frame/gameframe.js';

export const template = `
  <game-frame ref="frame"></game-frame>

  <infobar-area ref="infobar-area"></infobar-area>

  <infobar-move ref="infobar-move"></infobar-move>

`;