import {is_connected, are_neighbors, get_neighbors} from '/engine/modules/geomap/conn.js';
import {show_arrow, set_arrow, hide_arrow} from '/engine/gfx/arrows.js';

import {apply_capture, apply_kill} from '/client/game/economy.js'
import {areaSource} from '/client/layers/areas.js';
import {client} from '/client/websocket.js';
import {add_sys_message, play_sfx} from '/client/game/notifications.js';



export function move_to(from, to) {
  let tile = to.get('tile');

  if (to.get('unit') && from.get('unit') == 'art') {
    // artillery attack
    to.set('unit', null);
    to.set('dead', true);
    
    from.set('exhaust', 1);
  } else {
    // normal move
    to.set('unit', from.get('unit'));
    to.set('iso', from.get('iso'));

    // clear prev. cell
    from.set('unit', null);
    from.set('exhaust', 0);
  
    to.set('exhaust', tile == 'mount' ? 3 : (tile == 'forest' ? 2 : 1));
  }

}


export const map_state = {
  selected: null,

  disable_tooltip: false,

  // todo: itt: show flags, etc, 
  // todo: hook to settings
};


export function area_select(feature) {
  if (!feature) {
    // cancel selection
    map_state.selected = null;
    hide_arrow();

    return;
  }

  if (map_state.selected) {
    // Click with selection -> move to that area
    if (validate_move(map_state.selected, feature)) {
      // reset title
      title.update("");

      client.ws.request('Game:move', {
        area_id: map_state.selected.getId(),
        to_id: feature.getId()
      }).then(()=>{
        play_sfx("my_move");
      });
    } else {
      // 
      gui.flash("Can't move there", "danger", world.me);
    }

    // hide HUD & stuff:
    hide_arrow();
    map_state.selected = null;
  }

  else {
    const iso = feature.get('iso');
    const unit = feature.get('unit');
    const exhausted = feature.get('exhaust') > 0;

    if (world.me == iso && unit) {
      // can't move with exhausted unit
      if (exhausted)
        return;

      // Click on my unit -> we're about to move
      show_arrow(feature);
      map_state.selected = feature;
    } else {
      console.log("Clicked on empty area", feature.getId());
    }
  }
}


export function area_target(feature) {
  if (!map_state.selected)
    return;

  if (feature != null && validate_move(map_state.selected, feature)) {
    // we are pointing to a feature and it is a valid move
    set_arrow(feature);
  } else {
    // no feature under mouse
    // or not a valid move
    hide_arrow();
  }
}


export function validate_move(from, to) {
  const from_unit = from.get('unit') || null;
  const from_iso = from.get('iso');
  
  const to_unit = to.get('unit') || null;
  const to_iso = to.get('iso');

  if (from.get('exhaust'))
   return false;

  if (to_unit && from_iso != to_iso && from_iso) {
    // attack enemy unit
    if (from_unit == 'inf')
      return are_neighbors(from.getId(), to.getId());
    else
      return in_ring2(from.getId(), to.getId());
  } else {
    // can't attack my own unit
    if (to_unit)
      return false;

    // move to enemy or my area (empty)
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


client.ws.on('Game:move', ({err,iso,area_id,to_id,events})=>{
  if (err) {
    // move has failed
    add_sys_message(err, iso);

    return;
  }

  const from = areaSource.getFeatureById(area_id);
  const to = areaSource.getFeatureById(to_id);
  const iso_to = to.get('iso');

  const to_had_unit = to.get('unit');

  // move the unit
  move_to(from, to);

  if (iso_to != iso) {
    // conquer land
    if (to.get('tile') == 'city') {
      apply_capture(iso, iso_to);
    }

    if (to_had_unit) {
      apply_kill(iso_to);
    }
  }
});
