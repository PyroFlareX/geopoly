import {is_connected, are_neighbors, get_neighbors} from '/engine/modules/geomap/conn.js';
import {calculate_economy, apply_capture, apply_kill} from '/js/game/countries.js'
import {areaSource} from '/js/layers/areas.js';
import {client} from '/js/client.js';

export function move_to(from, to) {
  let tile = to.get('tile');

  // moves
  to.set('unit', from.get('unit'));
  to.set('iso', from.get('iso'));
  to.set('exhaust', tile == 'mount' ? 3 : (tile == 'forest' ? 2 : 1));

  // clear prev. cell
  from.set('unit', null);
  from.set('exhaust', 0);
}

export function validate_move(from, to) {
  const from_unit = from.get('unit') || null;
  const from_iso = from.get('iso');
  
  const to_unit = to.get('unit') || null;
  const to_iso = to.get('iso');

  if (from.get('exhaust'))
    return false;

  if (to_unit && from_iso != to_iso && from_iso) {
    // attack
    if (from_unit == 'inf')
      return are_neighbors(from.getId(), to.getId());
    else {
      return in_ring2(from.getId(), to.getId());
    }
  } else {
    // move
    return are_neighbors(from.getId(), to.getId());
  }
}

function in_ring2(id1, id2) {
  // idk man i was high
  const neighbors = get_neighbors(id1);

  // level 1 hit
  if (neighbors.includes(id2))
    return true;

  for (let neighbor of neighbors) {
    // level 2 hit
    if (get_neighbors(neighbor).includes(id2))
      return true;
  }

  return false;
}


client.ws.on('Areas:move', ({from_id, to_id})=>{
  const from = areaSource.getFeatureById(from_id);
  const to = areaSource.getFeatureById(to_id);
  const iso = from.get('iso');
  const iso2 = to.get('iso');

  const to_had_unit = to.get('unit');

  // move the unit
  move_to(from, to);

  if (iso2 != iso) {
    // conquer land
    if (to.get('tile') == 'city') {
      apply_capture(iso, iso2);
    }

    if (to_had_unit) {
      apply_kill(iso2);
    }
  }
});
