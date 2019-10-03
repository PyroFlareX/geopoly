import {ws_client} from '/engine/modules/websocket/wsclient.js';
import {world, countries} from '/engine/modules/worlds/world.js'
import {user_timeout} from '/engine/modules/turns/timeout.js'

import {reset_game_entities, apply_payday} from '/client/game/economy.js'
import {add_sys_message} from '/client/game/chat.js';



function do_turn_notify(txt, country) {
  if (!country)
    return;

  const text = txt+": "+(country.username||country.name);

  add_sys_message(text, country.iso);

  // todo: SFX
}

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

  ws_client.request("Game:end_turn", {});
}


export function leave_world() {

  //gui.flash("");
}



ws_client.on("Game:end_turn", ({iso, turn_end, round_end})=>{
  if (len(countries) == 0) {
    console.error("grr >:(");
    // world is not yet loaded
    return;
  }

  world.current = turn_end.current;
  world.turns = turn_end.turns;

  const country_curr = countries[world.current];

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
  const current_iso = world.current;
  user_timeout(current_iso, (p, ticks)=>{
    if (p < 1) {
      // update Frontend to show seconds left of my turn
      if (world.me == current_iso)
        gui.frame.setTurnTimeout(ticks);
    } else {
      gui.frame.setTurnTimeout(null);

      // at timeout of the turn, the user gets forced out by other players
      ws_client.request("Game:end_turn", {
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

      do_turn_notify("New emperor", countries[round_end.emperor]);
    } else {
      do_turn_notify("New round starts with", country_curr);
    }
  } else {
    do_turn_notify("Current turn", country_curr);
  }
});