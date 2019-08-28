import {ws_client} from '/engine/modules/websocket/wsclient.js';
import {world, countries} from '/engine/modules/worlds/world.js'


ws_client.on("Game:end_turn", ({iso, turn_end, round_end})=>{
  world.current = turn_end.current;
  world.turns = turn_end.turns;

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

      gui.flash("New emperor: "+(country_emp.username||country_emp.name), "danger", world.emperor);
    } else {
      gui.flash("New round: "+(country_curr.username||country_curr.name), "danger", world.current);      
    }
  } else {
    gui.flash("Current turn: "+(country_curr.username||country_curr.name), "danger", world.current);
  }
});

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