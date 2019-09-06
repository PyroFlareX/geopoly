import {client} from '/js/client.js';
import {areaSource} from '/js/layers/areas.js';
import {apply_resources} from '/js/game/countries.js'


const BUILDINGS = new Set(['barr','house','cita']);
const TILES = new Set(['river','bridge','city']);
const UNITS = new Set(['inf','cav','art']);


client.ws.on('Game:buy', ({iso,area_id,item_id,cost})=>{
  const feature = areaSource.getFeatureById(area_id);

  if (iso == null)
    iso = feature.get('iso');

  // -cost
  apply_resources(iso, cost, -1);

  // +item
  if (UNITS.has(item_id)) {
    feature.set('unit', item_id);
    feature.set('exhaust', 1);
  }
  else if (BUILDINGS.has(item_id)) {
    feature.set('build', item_id);
  }
  else if (TILES.has(item_id)) {
    feature.set('tile', item_id);
  }

  areaSource.changed();
});
