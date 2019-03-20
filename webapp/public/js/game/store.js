
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

export const turn = {
  me: null,
  players: [],

  current: null,

  turn: 0,
  round: 0,
};
