

export class MatchesGroup {
  constructor(client) {
    this.client = client;
  }

  request_list() {
    this.client.request("Matches:list");
  }

  list({matches}) {
    const m = gui.$refs.matches;

    m.matches = {};
    for (let match of matches)
      m.matches[match.mid] = match;
  }

  request_create(map, max_players, max_rounds) {
    this.client.request("Matches:create", {
      map: map,
      max_players: max_players,
      max_rounds: max_rounds,
    }).then(({match})=>{
      Cookie.set("mid", match.mid);

      window.location = '/client';
      //gui.dialog("join-match", match);
    });
  }

  create({match}) {
    gui.$refs.matches.matches[match.mid] = match;
  }

  request_join(mid, iso, username, area_id, deck_id) {
    Cookie.set("username", username);

    this.client.request("Matches:join", {
      mid: mid,
      iso: iso,
      aid: area_id,
      did: deck_id,
      username: username,
    }).then(({})=>{

    });
  }

  join({mid, username, iso}) {
    
    
    console.log(mid, username, iso)
    // gui.$refs.matches.matches[match.mid]
    // gui.$refs.matches.matches.push(match);
  }
}