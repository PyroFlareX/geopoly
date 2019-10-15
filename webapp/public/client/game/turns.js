import {client} from '/client/websocket.js';
import {world, countries} from '/engine/modules/worlds/world.js'
import {user_timeout} from '/engine/modules/turns/timeout.js'

import {reset_game_entities, apply_payday} from '/client/game/economy.js'
import {add_sys_message} from '/client/game/notifications.js';



export function handle_end_round({round,payday,emperor,ex_emperor,eliminated,orders}) {
  world.rounds = round;
 
  // resets areas & countries, recalculates economy attributes
  reset_game_entities();

  if (payday) {
    // update payday
    apply_payday(payday, emperor);
  }

  if (len(eliminated) > 0) {
    // reset shields for eliminated players
    for (let iso of eliminated) {
      countries[iso].shields = 0;
    }
  }

  if (emperor) {
    reassign_orders(orders);
  }
}


export function reassign_orders(orders) {
  // reassign orders of countries -- emperor starts the round
  for (let [iso, order] of Object.items(orders)) {
    countries[iso].order = order;
  }

  // remove countries
  const cache = {};
  Object.keys(countries).forEach((iso) => {
    cache[iso] = countries[iso];
    delete countries[iso]; 
  });

  // re-add countries in order
  const isos = Object.keys(cache);
  isos.sort((a,b)=> cache[a].order-cache[b].order);
  isos.forEach((iso) => {
    countries[iso] = cache[iso];
  });
}

window.reassign_orders = reassign_orders;


export function end_turn() {
  // todo: get user
  
  if (world.current != world.me) {
    gui.flash("It's not your turn.", 'white', world.current);

    return;
  }

  client.ws.request("Game:end_turn", {});
}


export function leave_world() {

  //gui.flash("");
}



client.ws.on("Game:end_turn", ({iso, turn_end, round_end})=>{
  if (len(countries) == 0) {
    console.error("grr >:(");
    // world is not yet loaded
    return;
  }

  world.current = turn_end.current;
  world.turns = turn_end.turns;

  const current_iso = world.current;
  const c_curr = countries[current_iso];

  // update TAB-countries GUI if opened
  if (gui.opened == 'countries') {
    gui.$refs['infobar-countries'].$forceUpdate()
  }

  // update browser title if it's my turn
  if (world.current == world.me) {
    title.update("(1) -");
  } else {
    title.update("");
  }

  // set timeout for user's end turn
  user_timeout(current_iso, (p, ticks)=>{
    if (p < 1) {
      // update Frontend to show seconds left of my turn
      if (world.me == current_iso)
        gui.frame.setTurnTimeout(ticks);
    } else {
      gui.frame.setTurnTimeout(null);

      // at timeout of the turn, the user gets forced out by other players
      client.ws.request("Game:end_turn", {
        timeout: current_iso
      });
    }
  });

  // round has ended too -> flash & sfx & chat notification
  if (round_end) {
    handle_end_round(round_end);

    if (round_end.emperor) {
      // Update title anyway
      if (world.current != world.me)
        title.update("(New Emperor!) -");

      const c_emp = countries[round_end.emperor];

      add_sys_message("emperor", c_emp.iso, c_emp.username||c_emp.name);
      return;
    }
  }

  if (current_iso == world.me)
    add_sys_message("my_turn", c_curr.iso, c_curr.username||c_curr.name);
  else
    add_sys_message("new_turn", c_curr.iso, c_curr.username||c_curr.name);
});
