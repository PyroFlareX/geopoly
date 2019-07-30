
export const img_dim = {w: 512, h: 512};
export const flags = {};


// Load and interpret flags
// load(function() {
//   let flagsImg = new Image;
//   let NX = 5;
//   let imgLoaded = false;
//   let loader_canvas = document.createElement('canvas');
//   loader_canvas.width = img_dim.w;
//   loader_canvas.height = img_dim.h;

//   flagsImg.onload = () => {
//     imgLoaded = true;

//     this.loaded();
//     //gfx.flag = [FW, FH];
//   };
//   flagsImg.src = '/css/flags.png';


//   this.after_loadend(() => {
//     let ctx = loader_canvas.getContext("2d");
//     let isos = Object.keys(isocolors);
//     isos.sort();

//     // render and add flags to countries
//     for (let [flagi, iso] of enumerate(isos)) {
//       ctx.clearRect(0,0,img_dim.w, img_dim.h);

//       let x = flagi % NX, y = Math.floor(flagi / NX);

//       ctx.drawImage(flagsImg, x*img_dim.w,y*img_dim.h, img_dim.w, img_dim.h, 0,0,img_dim.w, img_dim.h);
//       let img = new Image;
//       img.src = loader_canvas.toDataURL();

//       // set flag
//       flags[iso] = img;
//     }
//   });
// });

let loader_canvas = document.createElement('canvas');
loader_canvas.width = img_dim.w;
loader_canvas.height = img_dim.h;
let ctx = loader_canvas.getContext("2d");

export function getFlag(area) {
  if (typeof area == 'string') var area = {iso: area};
  else if (area.getProperties) var area = area.getProperties();
  let iso = area.iso;

  if (iso && flags[iso]) {
    if (flags[iso] == 'loading')
      return flags['AA'];

    return flags[iso];
  }

  if (has_texture.has(iso)) {
    // load flag texture
    let flagsImg = new Image;
    flags[iso] = 'loading';

    flagsImg.onload = () => {
      // todo: cut into shield shape?
      flags[iso] = flagsImg;
    };
    flagsImg.src = '/img/flags/flag_'+iso+'.png';
  } else {
    // create image of color

  }

  return flags['AA'];
}

export const has_texture = new Set([
  "AG","ES","PT","GR","SC","IE","UK","FR","SV","BU","LO","PO","NP","IF","PP","GE","TU","MI","IT","DE","BB","TT","LU","NL","UT","FF","DK","NO","SE","FI","LT","PL","CZ","AT","HU","RO","MD","BG","RS","TU","TR","JY","BY","GO","RU","NV","GD","CY"
]);
