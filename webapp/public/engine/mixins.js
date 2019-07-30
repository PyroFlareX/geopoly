import {getColor, has_texture} from '/engine/colors.js';


export const _mixins = {
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
    else if (area.get || area.getProperties) iso = area.get('iso');
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
