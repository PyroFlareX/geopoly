
/**
 * Store
 *
 */

export let rules = {};
fetch('/json/rules.json', {cache: 'force-cache'}).then((resp) => {
  return resp.json();
}).then((resp) => {
  rules = resp;
});

export let conn = defaultdict(list, true);
fetch('/json/conn.json', {cache: 'force-cache'}).then((resp) => {
  return resp.json();
}).then((resp) => {
  for (let [iso1, iso2] of resp) {
    conn[iso1].push(iso2);
    conn[iso2].push(iso1);
  }
});

export let countries = {};
fetch('/json/countries.json', {cache: 'force-cache'}).then((resp) => {
  return resp.json();
}).then((resp) => {
  countries = resp;
});


export let units = {};
fetch('/client/units', {cache: 'force-cache'}).then((resp) => {
  return resp.json();
}).then((resp) => {

  for (let [k, unit] of Object.items(resp)) {
    unit.dispname = professions[k];

    units[k] = unit;
  }
});


const professions = {
  10: 'Player avatar',
  6: 'Bard',
  0: 'Footman',
  4: 'Archer',
  1: 'Pikeman',
  2: 'Cavalry',
  5: 'Catapult',
  3: 'Knight',
  7: 'Barbarian',
  8: 'Thug',
  9: 'Strongman',
  11: 'Defender',
};

export const match = {
  me: null,
  spectator: false,
  can_join: false,

  mid: null,
  max_players: null,
  max_rounds: null,
  map: null,

  current: null,
  turns: 0,
  rounds: 0,
  isos: [],
};

export const decks = [];

export function set_turn(turn0) {
  let new_round = turn0.rounds != match.rounds;

  match.current = turn0.current;
  match.rounds = turn0.rounds;
  match.turns = turn0.turns;

  if (turn0.isos)
    match.isos = turn0.isos;  

  return new_round;
}


export const EVENT = {
  NONE: 0,

  MOVE: 1,
  CONQUER: 2,
  BATTLE: 3,
  ANNIHILATE: 4,
  ENCIRCLE: 5,

  RECRUIT: 10,
  SHIPBUILD: 11,

  CLAIM: 12,

};
