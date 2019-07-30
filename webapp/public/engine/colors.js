
export const has_texture = new Set([]);

export const colors = {
  not_found: new Color(0, 255, 255),
  mil_default: new Color(160, 10, 14),

  BLACK: new Color(0,0,0),
  WHITE: new Color(255,255,255),

  afk: new Color([90, 90, 90]),
  base: new Color([211, 191, 158]),
  base_edge: new Color([0,0,0]),
  water: new Color([231, 245, 254]),
  water_border: new Color([131, 145, 154]),

  diplo_me: new Color([120, 198, 120]),
  diplo_enemy: new Color([255, 180, 120]),
  diplo_ally: new Color([121, 255, 255]),
  diplo_closeally: new Color([248, 255, 106]),

  mils_0: new Color([246,239,247]),
  mils_1: new Color([189,201,225]),
  mils_2: new Color([103,169,207]),
  mils_3: new Color([28,144,153]),
  mils_4: new Color([1,108,89]),

};

export const isocolors = {
  'AA': colors.base,
};

// todo: later: define too_light, when two components are > 400 and 1 is < 100
const too_light = new Set([]);

export let color_settings = {
  colorscheme: 'softlight'
};

export function getColor(area) {
  if (typeof area == 'string') var area = {iso: area};
  else if (area.getProperties) var area = area.getProperties();
  let iso = area.iso;

  if (!iso)
    return colors.base;
  if (!isocolors[iso])
    return colors.not_found;

  // use a different color if contrast is white
  if (too_light.has(iso) && ['softlight', 'hardlight'].includes(color_settings.colorscheme))
    return isocolors[iso].blend(colors.base, 'multiply');

  if (color_settings.colorscheme == 'inverted')
    return isocolors[iso].blend(colors.base, 'multiply');

  return isocolors[iso];

  //return colors.base;
}

export function getHighlight(color) {
  return color.blend(colors.base, 'multiply');
}

export function getMapBlend(color, iso) {
  let out_color = null;

  if (color_settings.colorscheme == 'inverted') {
    // inverted (multiply)
    out_color = isocolors[iso] || colors.base;
  } else if (['softlight','lineardodge','screen','darken','multiply'].includes(color_settings.colorscheme)) {
    // softlight, light (lineardodge), screen, vivid (multiply)
    out_color = colors.base.blend(color, color_settings.colorscheme);
  } else {
    // faded (normal), hardlight
    out_color = color.blend(colors.base, color_settings.colorscheme);
  }

  return out_color;
}
