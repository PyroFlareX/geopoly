import {maps} from '/js/game/maps.js';
import {colors,getColor,getMapBlend} from '/engine/colors.js';

// openlayers Minimap for the matchmaking component
ol.style.IconImageCache.shared.setSize(512);

const areaSource = new ol.source.Vector({
});


const format = new ol.format.GeoJSON();


let map = null;
/*
Steak knife card shark
Con job boot cut
Dog town blood bath
Rib cage soft tail
*/


export function switch_map(map_id) {
  const url = `/maps/${map_id}.geojson`;

  if (map) {
    // dispose
    map = null;
    $('#app-minimap').innerHTML = '';
  }

  map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.Stamen({
          layer: 'watercolor'
        })
      }),
      new ol.layer.Vector({
        source: areaSource,
        style: (feature, res) => {
          const iso = feature.get('iso');
          let bg = colors.base;

          return new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: colors.base_edge.rgb(),
              width: 1
            }),
            fill: new ol.style.Fill({
              color: bg.rgb()
            }),
          });
        }
      })
    ],
    target: 'app-minimap',
    interactions: ol.interaction.defaults({
      doubleClickZoom: false,
      dragAndDrop: false,
      dragPan: false,
      keyboardPan: false,
      keyboardZoom: false,
      mouseWheelZoom: false,
      pointer: false,
      select: false
    }),
    controls: ol.control.defaults({
      attribution: false,
      zoom: false,
    }),
    view: new ol.View({
      center: maps[map_id].center,
      zoom: maps[map_id].zoom,
    })
  });

  fetch(url, {cache: 'force-cache'}).then((resp) => {
    return resp.json();
  }).then((resp)=>{
    areaSource.clear();
    areaSource.addFeatures(format.readFeatures(resp));
  });
}

// map.on('click', (event) => {

//   cm.
// });


// let component = null;

// export function add_component(cm) {
//   component = cm;
// }
