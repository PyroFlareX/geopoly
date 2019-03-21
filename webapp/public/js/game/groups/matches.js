import {set_turn} from '/js/game/store.js';

export class MatchesGroup {
  constructor(client) {
    this.client = client;
  }

  request_end_turn() {

    this.client.request('Matches:end_turn', {

    }).then(() => {

      // todo: temporal solution: call AI ender
      this.client.request('Dev:ai_act', {});

    });
  }

  end_turn({match}) {
    console.info("%cTurn "+(match.turns-1)+" ended", "color: blue");

    const is_new_round = set_turn(match);

    if (is_new_round)
      console.info("%cRound "+(match.rounds-1)+" ended", "color: white; background: blue");
  }

  end_game({reason}) {
    // todo: use dialog (winner / loser / draw)
    console.info("%cGame ended: "+reason, "color: white; background: blue");

    alert("Match has ended. Reason: " + reason);
  }
}