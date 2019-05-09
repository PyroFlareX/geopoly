import {set_turn} from '/js/game/store.js';
//import {reset_moves} from '/js/ol/gfx.js';


export class GameGroup {
  constructor(client) {
    this.client = client;
  }

  request_end_turn() {
    this.client.request('Game:end_turn', {

    }).then(() => {

    });
  }

  end_turn({match}) {
    console.info("%cTurn "+(match.turns-1)+" ended", "color: blue");

    const is_new_round = set_turn(match);

    if (is_new_round) {
      reset_moves();
      console.info("%cRound "+(match.rounds-1)+" ended", "color: white; background: blue");
    }
  }

  end_game({reason}) {
    // todo: use dialog (winner / loser / draw)
    console.info("%cGame ended: "+reason, "color: white; background: blue");

    alert("Match has ended. Reason: " + reason);
  }
}