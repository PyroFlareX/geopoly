import {client} from '/client/websocket.js';
import {areaSource} from '/client/layers/areas.js';
import {apply_resources} from '/client/game/economy.js'
import {world, countries} from '/engine/modules/worlds/world.js'
import {add_sys_message, play_sfx} from '/client/game/notifications.js';

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


export function buy_item(area, item_id, sacrifice) {
  ws_client.request("Game:buy", {
    area_id: area.id,
    item_id: item_id,
    sacrifice: sacrifice
  }).then(()=>{
    play_sfx("my_buy");
  });
}

client.ws.on('Game:buy', ({iso,area_id,item_id,cost,err})=>{
  if (err) {
    // Buy fail
    add_sys_message(err, iso);

    return;
  }

  if (world.me == iso) {
    // I've made a buy, reset title
    title.update("");
  }

  const is_sacrifice = cost['shields'] > 0;
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
  const item_name = ITEM_NAMES[item_id].title();

  add_sys_message(is_sacrifice ? 'sacrifice' : 'buy', c.username||c.name, item_name, feature.get('name'));
});


client.ws.on('Game:tribute', ({iso,to_iso,amount})=>{

  countries[iso].gold -= amount;
  countries[to_iso].gold += amount;

  const c = countries[iso];

  add_sys_message('tribute', iso, c.username||c.name, amount, countries[to_iso].name);
});

