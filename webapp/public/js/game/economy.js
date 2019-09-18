import {client} from '/js/client.js';
import {areaSource} from '/js/layers/areas.js';
import {apply_resources} from '/js/game/countries.js'
import {countries} from '/engine/modules/worlds/world.js'
import {add_sys_message} from '/js/game/chat.js';

const BUILDINGS = new Set(['barr','house','cita']);
const TILES = new Set(['river','bridge','city']);
const UNITS = new Set(['inf','cav','art']);


const ITEM_NAMES = {
  'inf': 'infantry',
  'cav': 'cavalry',
  'art': 'artillery',

  'barr': 'barracks',
  'house': 'house',
  'cita': 'citadel',

  'river': 'river',
  'bridge': 'bridge',
  'city': 'settlement',
};


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

  const c = countries[iso];
  const item_name = ITEM_NAMES[item_id];

  add_sys_message((c.username||c.name) + ' has bought ' + item_name.title() + ' on ' + feature.get('name'), iso);
});


client.ws.on('Game:tribute', ({iso,to_iso,amount})=>{

  countries[iso].gold -= amount;
  countries[to_iso].gold += amount;

  const c = countries[iso];
  add_sys_message((c.username||c.name) + ' has given ' + amount + ' gold to ' + countries[to_iso].name, iso);
});


// client.ws.on('Game:sacrifise', ({iso,to_iso,amount})=>{
// 
// });
