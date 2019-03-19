import {getColor} from '/js/game/colors.js';

Vue.mixin({
  
  data: function() {
    return {
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