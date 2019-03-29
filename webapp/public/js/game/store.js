
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

// 1853?
// todo: maybe store it in the server later, idk
export const countries = {
  'UK': {iso: 'UK', name: "United Kingdom", player: {"name": "Victoria I", "default": true}},
  'FR': {iso: 'FR', name: "French Colonial Empire", player: {"name": "Napoleon III", "default": true}},
  'RU': {iso: 'RU', name: "Russian Empire", player: {"name": "Nicholas I", "default": true}},
  'AT': {iso: 'AT', name: "Austria-Hungary", player: {"name": "Franz Joseph I", "default": true}},
  'DE': {iso: 'DE', name: "German Empire", player: {"name": "Wilhelm I", "default": true}},
  'TR': {iso: 'TR', name: "Ottoman Empire", player: {"name": "Abdülmecid I", "default": true}},

  'SE': {iso: 'SE', name: "Sweden-Norway Union", player: {"name": "Oscar I", "default": true}},
  'IT': {iso: 'IT', name: "Italy", player: {"name": "Victor Emmanuel II", "default": true}},
  'DK': {iso: 'DK', name: "Denmark", player: {"name": "Frederick VII", "default": true}},
  'ES': {iso: 'ES', name: "Spain", player: {"name": "Isabella II", "default": true}},
  'NL': {iso: 'NL', name: "Netherlands", player: {"name": "William III", "default": true}},
  'BE': {iso: 'BE', name: "Belgium", player: {"name": "Leopold I", "default": true}},
  'CH': {iso: 'CH', name: "Switzerland", player: {"name": "Naeff", "default": true}},
  'PT': {iso: 'PT', name: "Portugal", player: {"name": "Peter V", "default": true}},
  'EL': {iso: 'EL', name: "Greece", player: {"name": "Otto", "default": true}},
  'RO': {iso: 'RO', name: "Romania", player: {"name": "Carol I", "default": true}},
  'RS': {iso: 'RS', name: "Serbia", player: {"name": "Milan I", "default": true}},
};