
export class WorldsController {

  // end_turn({match}) {
  //   console.info("%cTurn "+(match.turns-1)+" ended", "color: blue");

  //   //const is_new_round = set_turn(match);

  //   if (is_new_round) {
  //     reset_moves();
  //     console.info("%cRound "+(match.rounds-1)+" ended", "color: white; background: blue");
  //   }
  // }

  // end_game({reason}) {
  //   // todo: use dialog (winner / loser / draw)
  //   console.info("%cGame ended: "+reason, "color: white; background: blue");

  //   alert("Match has ended. Reason: " + reason);
  // }

  // request_find(iso, name, age, weights) {
  //   let formData = new FormData();
  //   formData.append('iso', iso);
  //   formData.append('name', name);
  //   formData.append('age', age);
  //   formData.append('weights', JSON.stringify(weights));

  //   fetch('/worlds/player', {
  //     method: "POST",
  //     body: formData
  //   })
  //   .then((resp) => { return resp.json() })
  //   .then(function(resp) {
  //     if (resp.err == 'area_not_found') {
  //       alert("Could not find an empty castle in this country. Please try with another one");
  //       return;
  //     }

  //     // ok
  //     window.location = '/';
  //   });
  // }
}