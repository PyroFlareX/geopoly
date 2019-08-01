
export const countries = {};
fetch('/json/countries.json', {cache: 'force-cache'}).then((resp) => {
  return resp.json();
}).then((resp) => {
  for (let [k, country] of Object.items(resp)) {
    countries[k] = country;
  }
});


export const world = {
  wid: null,
  pid: null,
  me: null,
  spectator: false,

  players: {},

  turns: null,
  rounds: null,
  max_players: null,
  max_rounds: null,
  turn_time: null,
};
