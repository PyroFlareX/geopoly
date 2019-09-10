import {_mixins} from '/engine/mixins.js';

import {component as playtesting} from '/js/gui/frame/playtesting.js';
import {component as mapselect} from '/js/gui/dialog/map-select.js';

Vue.mixin({
  
  data: function() {
    return {
      me: null,
      ..._mixins
    };
  }
});

export const template = `
  <dialog-map-select ref="dialog-map-select"></dialog-map-select>

  <playtesting ref="playtesting"></playtesting>
`;
