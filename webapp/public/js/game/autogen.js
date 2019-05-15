

let model = null
tf.loadLayersModel('/keras/model.json').then((m) => {
  model = m;

  console.log("Autoencoder model loaded");

  _callback();
  status.is_ready = true;
});

const imX = 32, imY = 48;
const encoding_dim = 16;
let _callback = function(){};

export const status = {
  is_ready: false,
};

export function onReady(callback) {
  _callback = callback;
}

export function get_img(arr, color, bgcolor) {
  let rnd_encoded = tf.tensor2d([arr]);

  let decoded = model.predict(rnd_encoded);

  let dec_img = decoded.dataSync();

  return draw(dec_img, color, bgcolor);
}


function draw(pixels, CR, CB) {
  // pixels are inverted y/x
  const loader_canvas = document.createElement("canvas");
  const ctx = loader_canvas.getContext("2d");
  
  loader_canvas.width = imX;
  loader_canvas.height = imY;

  let idata = ctx.getImageData(0,0,imX, imY);
  let i = 0;

  for (let y of range(imY)) {
    for (let x of range(imX)) {
      let p = x * imY + y;

      let shade = pixels[p];
      let col = CB.interpolate(CR, shade);

      idata.data[i*4 + 0] = col[0];
      idata.data[i*4 + 1] = col[1];
      idata.data[i*4 + 2] = col[2];
      idata.data[i*4 + 3] = 255;

      i++;
    }
  }

  // for (let i of range(imX*imY)) {
  // }

  //     let i = x*imY + y;


  //     // idata.data[i*4 + 0] = round(CR.r*shade);
  //     // idata.data[i*4 + 1] = round(CR.g*shade);
  //     // idata.data[i*4 + 2] = round(CR.b*shade);
  //     // idata.data[i*4 + 3] = 255;
  //   }
  // }

  ctx.putImageData(idata, 0, 0);

  // convert to image
  return loader_canvas.toDataURL();
}
