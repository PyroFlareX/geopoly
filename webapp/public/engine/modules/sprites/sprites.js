import {load, onload} from '/js/game/loader.js';


export const img_dim = {w: 42, h: 50};
export const sprites = {};

let images = {};

let loader_canvas = document.createElement('canvas');
loader_canvas.width = img_dim.w;
loader_canvas.height = img_dim.h;


for (let i of list(range(1,15)).concat(list(range(21,27)))) {
  load(function() {
    images[i] = new Image;
    images[i].onload = () => {
      this.loaded();
    };
    images[i].src = `/img/units/U${i}.png`;
  });
}

onload(() => {
  let ctx = loader_canvas.getContext("2d");

  for (let [i, spriteSheet] of Object.items(images)) {
    sprites[i] = [];
    
    // render and add flags to countries
    for (let direction of range(8)) {
      let y = img_dim.h*direction;
      let anims = [];

      for (let j of range(6)) {
        let x = img_dim.w*j;

        ctx.clearRect(0, 0, img_dim.w, img_dim.h);
        ctx.drawImage(spriteSheet, x,y,img_dim.w,img_dim.h, 0,0,img_dim.w, img_dim.h);

        let img = new Image;
        img.src = loader_canvas.toDataURL();

        anims.push(img);
      }

      sprites[i][direction] = anims;
    }
  }
});