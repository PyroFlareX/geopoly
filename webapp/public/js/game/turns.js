import {ws_client} from '/engine/modules/websocket/wsclient.js';
import {world, countries} from '/engine/modules/worlds/world.js'
import {calculate_economy, reassign_orders} from '/js/game/countries.js'
import {add_sys_message} from '/js/game/chat.js';


ws_client.on("Game:end_turn", ({iso, turn_end, round_end})=>{
  world.current = turn_end.current;
  world.turns = turn_end.turns;

  // at each turn, we recalculate country economies
  calculate_economy();


  const country_curr = countries[world.current];

  if (round_end) {
    const {round,payday,emperor,ex_emperor,eliminated} = round_end;

    world.rounds = round;

    console.log("TODO: Eliminated: ", eliminated);

    if (len(countries) == 0) {
      console.error("grr");
      // world is not yet loaded
      return;
    }

    if (payday) {
      // update payday
      for (let [iso,country] of Object.items(countries)) {
        country.gold += payday[iso];
      }
    }

    // update ex and current emperors
    if (ex_emperor)
      countries[ex_emperor].emperor = false;

    if (emperor) {
      const country_emp = countries[emperor];
      country_emp.emperor = true;
      country_emp.gold += 20;

      // update orders of countries -- emperor starts
      reassign_orders(emperor);

      do_turn_notify("New emperor", country_emp);
    } else {
      do_turn_notify("New round", country_curr);
    }
  } else {
    do_turn_notify("Current turn", country_curr);
  }
});


function do_turn_notify(txt, country) {
  const text = txt+": "+(country.username||country.name);

  add_sys_message(text, country.iso);

  // todo: SFX
}



export function end_turn() {
  // todo: get user
  
  if (world.current != world.me) {
    console.error("It's not your turn");
    return;
  }

  ws_client.request("Game:end_turn", {});
}


export function leave_world() {

  //gui.flash("");
}