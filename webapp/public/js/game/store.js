
/**
 * Store
 *
 */

export let rules = {};
fetch('/js/game/rules.json').then((resp) => {
  return resp.json();
}).then((resp) => {
  rules = resp;
});

export const match = {
  me: null,

  mid: null,
  max_players: null,
  max_rounds: null,
  map: null,

  current: null,
  turns: 0,
  rounds: 0,
  isos: [],
};

export function set_turn(turn0) {
  let new_round = turn0.rounds != match.rounds;

  match.current = turn0.current;
  match.rounds = turn0.rounds;
  match.turns = turn0.turns;

  if (turn0.isos)
    match.isos = turn0.isos;  

  return new_round;
}
