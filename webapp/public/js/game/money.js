import {client} from '/js/client.js';
import {areaSource} from '/js/layers/areas.js';
import {apply_resources} from '/js/game/economy.js'
import {world, countries} from '/engine/modules/worlds/world.js'
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

const BUY_ERRORS = {
  cant_buy_after_move: "You can't buy new items after you have moved in your turn.",

  item_exists: "Item already exists on that area.",
  bad_conf: "Unexpected item.",
  not_mine: "It's not your area.",

  not_enough_gold: "You don't have enough money.",
  not_enough_pop: "You don't have enough population. Buy more buildings.",

  missing_city: "You can only build over a city.",
  missing_river: "You can only build a bridge over rivers.",
  missing_: "Rawr XD",
};


client.ws.on('Game:buy', ({iso,area_id,item_id,cost,err})=>{
  if (err) {
    // Buy fail
    add_sys_message(BUY_ERRORS[err]||('unknown error: '+err), iso);

    return;
  }

  if (world.me == iso) {
    // I've made a buy, reset title
    title.update("");
  }

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
  add_sys_message((c.username||c.name) + ' has given ' + amount + ' golds to ' + countries[to_iso].name, iso);
});


// client.ws.on('Game:sacrifise', ({iso,to_iso,amount})=>{
// 
// });
