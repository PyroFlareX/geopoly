
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

export const conn = defaultdict(list, true);
fetch('/json/conn.json', {cache: 'force-cache'}).then((resp) => {
  return resp.json();
}).then((resp) => {
  for (let [iso1, iso2] of resp) {
    conn[iso1].push(iso2);
    conn[iso2].push(iso1);
  }
});

export const countries = {};
fetch('/json/countries.json', {cache: 'force-cache'}).then((resp) => {
  return resp.json();
}).then((resp) => {
  for (let [k, country] of Object.items(resp)) {
    countries[k] = country;
  }
});


export const units = {};
fetch('/units/config', {cache: 'force-cache'}).then((resp) => {
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
  wid: null,
  pid: null,

  // my iso @todo: rename
  me: null,

  players: {},

  spectator: false,
  can_join: false,

  turns: 0,
  max_players: null,
  turn_time: null,
};
