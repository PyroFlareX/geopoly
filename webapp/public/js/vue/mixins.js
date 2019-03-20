import {getColor} from '/js/game/colors.js';
import {UNITS} from '/js/game/lib.js';

Vue.mixin({
  
  data: function() {
    return {
      UNITS_INF: ['inf_light','inf_home','inf_heavy','inf_skirmish',],
      UNITS_CAV: ['cav_lancer','cav_hussar','cav_dragoon','cav_heavy',],
      UNITS_ART: ['art_light','art_heavy','art_mortar'],
      UNITS: UNITS,

      area_background: function(area) {
        var color = getColor(area);
        //var f = contrast == 'white' ? 1 : -1;

        var bg = 'background: ' + color.rgba() + ';';
        var text = 'color: ' + color.contrast() + ';';

        return bg + text;
      },

      country_background: function(country) {
        // todo...
      },

    };
  },

});