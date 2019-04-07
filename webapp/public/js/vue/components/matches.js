import {template} from "/js/vue/components/matches.vue.js"
 
function guidToBytes(guid) {
  var bytes = [];
  guid.split('-').map((number, index) => {
      var bytesInChar = index < 3 ? number.match(/.{1,2}/g).reverse() :  number.match(/.{1,2}/g);
      bytesInChar.map((byte) => { bytes.push(parseInt(byte, 16));})
  });
  return bytes;
}

function bytesToBits(bytes) {
  let bits = [];

  for (let byte of bytes) {
    for (let i of range(8)) {
      bits.push((byte >> i) & 0x01);
    }
  }

  return bits;
}

const loader_canvas = document.createElement("canvas");
const ctx = loader_canvas.getContext("2d");
loader_canvas.width = 10;
loader_canvas.height = 10;

export let component = Vue.component('matches', {
  template: template,

  data: function() {
    return {
      show: false,

      matches: {},
      t: 0
    }
  },
  methods: {
    join: function(match) {
      window.location = '/client?mid='+match.mid;
    },

    match_icon_src: function(match) {
      let bytes = guidToBytes(match.mid);
      let bits = bytesToBits(bytes);


      const W = loader_canvas.width, H = loader_canvas.height;

      //ctx.fillStyle = 'white';
      ctx.clearRect(0,0,W,H);

      let color = new Color(bytes[16-3], bytes[16-2], bytes[16-1]);

      let idata = ctx.getImageData(0,0,W,H);
      let i = 0;

      for (let y of range(H)) {
        for (let x of range(W)) {

          if (!bits[i]) {
            idata.data[i*4 + 0] = color[0];
            idata.data[i*4 + 1] = color[1];
            idata.data[i*4 + 2] = color[2];
            idata.data[i*4 + 3] = 255;            
          }

          i++;
        }
      }

      ctx.putImageData(idata, 0, 0);

      // convert to image
      return loader_canvas.toDataURL();
    },

    map_name: function(map) {
      switch(map) {
        case 1: return "1853 Crimean War"; break;
        case 2: return "1870 Franco-Prussian war"; break;
        case 3: return "1848 Hungarian Revolution"; break;
        case 4: return "1861 American Civil War"; break;
        case 5: return "1899 Boxer Rebellion"; break;
        case 6: return "1807 Napoleonic Wars"; break;
        case 7: return "1812 French Invasion of Russia"; break;
        case 8: return "1830 Texas-Indian wars"; break;
        case 9: return "1843 Rise against the Ottoman"; break;
        case 10: return "1879 Anglo-Zulu war"; break;
        case 11: return "1866 Austro-Prussian war"; break;
      }
    }
  },

});