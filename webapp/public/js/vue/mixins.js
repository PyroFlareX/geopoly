import {getColor} from '/js/game/colors.js';
import {UNITS} from '/js/game/lib.js';
import {units} from "/js/game/store.js";

const has_texture = new Set([
  "AG","ES","PT","GR","SC","IE","UK","FR","SV","BU","LO","PO","NP","IF","PP","GE","TU","MI","IT","DE","BB","TT","LU","NL","UT","FF","DK","NO","SE","FI","LT","PL","CZ","AT","HU","RO","MD","BG","RS","TU","TR","JY","BY","GO","RU","NV","GD","CY"
]);

Vue.mixin({
  
  data: function() {
    return {
      // UNITS_INF: ['inf_light','inf_home','inf_heavy','inf_skirmish',],
      // UNITS_CAV: ['cav_lancer','cav_hussar','cav_dragoon','cav_heavy',],
      // UNITS_ART: ['art_light','art_heavy','art_mortar'],
      // UNITS: UNITS,
      units: units,

      open_dialog: function(name, ...params) {
        gui.dialog(name, ...params);
      },

      open_infobar: function(name, ...params) {
        gui.infobar(name, ...params);
      },
      
      maxHeight: function () {
        var h = $('#app-map').offsetHeight;
        return 'max-height: ' + (h - 220) + 'px;';
      },

      area_background: function(area) {
        var color = getColor(area);
        var bg = 'background: ' + color.rgba() + ';';
        var text = 'color: ' + color.contrast() + ';';

        return bg + text;
      },

      unit_background: function(unit) {
        let color = getColor(unit), i = 0;
        while (color.contrast() == 'black' && i < 8)
          color = color.shade(-0.15);

        var bg = 'background: ' + color.rgba() + ';';
        var text = 'color: ' + color.contrast() + ';';

        return bg + text;
      },
      
      herald: function(area) {
        let iso;
        if (typeof area == 'string') iso = area;
        else if (area instanceof ol.Feature) iso = area.get('iso');
        else iso = area.iso;

        if (has_texture.has(iso)) {
          var background = "url('/img/flags/flag_"+iso+".png')";
          var bg = 'background-image: ' + background + ';background-position:center;';
        } else {
          var color = getColor(area);
          var bg = 'background-color: ' + color.rgb() + ';';
        }

        return bg;
      },
    };
  },

});