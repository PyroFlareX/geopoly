import {load} from '/js/game/loader.js';
import {countrySource} from '/js/ol/layers/countries.js';

export const colors = {
  not_found: new Color(0, 255, 255),
  mil_default: new Color([160, 10, 14]),

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

const isocolors = {
  'AA': colors.base,
  'UK': new Color([207, 20, 43]),
  'FR': new Color([3, 7, 147]),
  'RU': new Color([63, 120, 35]),
  'IT': new Color([30, 190, 75]),
  'SE': new Color([0, 40, 104]),
  'DK': new Color([230, 29, 24]),
  'AT': new Color([180, 180, 180]),
  'DE': new Color([53, 91, 87]),
  'ES': new Color([255, 239, 68]),
  'NL': new Color([253, 73, 29]),
  'BE': new Color([128, 78, 56]),
  'CH': new Color([232, 43, 54]),
  'PT': new Color([0, 81, 151]),
  'EL': new Color([116, 172, 223]),
  'RO': new Color([145, 30, 180]),
  'RS': new Color([128, 106, 43]),
  'TR': new Color([194, 24, 40]),

  // 'EG': new Color([158, 11, 33]),
  // 'MA': new Color([243, 67, 38]),
  // 'IR': new Color([245, 130, 48]),
};

export let color_settings = {
  colorscheme: 'softlight'
};

export function getColor(area) {
  if (typeof area == 'string') var area = {iso: area};
  else if (area instanceof ol.Feature) var area = area.getProperties();
  let iso = area.iso;

  if (iso)
    return isocolors[iso] || colors.not_found;

  return colors.base;
}

export function getHighlight(color) {
  return color.blend(new Color(255, 255, 255), 'softlight');
}

export function getMapBlend(color) {
  if (color_settings.colorscheme == 'multiply') {
    return color;
  } else if (['softlight','lineardodge','screen','darken'].includes(color_settings.colorscheme)) {
    return colors.base.blend(color, color_settings.colorscheme);
  }
  
  return color.blend(colors.base, color_settings.colorscheme);
}



export const img_dim = {w: 240, h: 160};
export const flags = {};


// Load and interpret flags
load(function() {
  let flagsImg = new Image;
  let NX = 5;
  let imgLoaded = false;
  let loader_canvas = document.createElement('canvas');
  loader_canvas.width = img_dim.w;
  loader_canvas.height = img_dim.h;

  flagsImg.onload = () => {
    imgLoaded = true;

    this.loaded();
    //gfx.flag = [FW, FH];
  };
  flagsImg.src = '/css/flags.png';


  this.after_loadend(() => {
    let ctx = loader_canvas.getContext("2d");
    let isos = Object.keys(isocolors);
    isos.sort();

    // render and add flags to countries
    for (let [flagi, iso] of enumerate(isos)) {
      ctx.clearRect(0,0,img_dim.w, img_dim.h);

      let x = flagi % NX, y = Math.floor(flagi / NX);

      ctx.drawImage(flagsImg, x*img_dim.w,y*img_dim.h, img_dim.w, img_dim.h, 0,0,img_dim.w, img_dim.h);
      let img = new Image;
      img.src = loader_canvas.toDataURL();

      // set flag
      flags[iso] = img;
    }
  });
});


export function getFlag(area) {
  if (typeof area == 'string') var area = {iso: area};
  else if (area instanceof ol.Feature) var area = area.getProperties();
  let iso = area.iso;

  if (iso && flags[iso])
    return flags[iso];

  return flags['AA'];
}