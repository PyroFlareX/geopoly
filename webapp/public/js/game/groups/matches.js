

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
      window.location = '/client';
      //gui.dialog("join-match", match);
    });
  }

  create({match}) {
    gui.$refs.matches.matches[match.mid] = match;
  }

  request_join(mid, iso, username, area_id, deck_id) {

    this.client.request("Matches:join", {
      mid: mid,
      iso: iso,
      aid: area_id,
      did: deck_id,
      username: username,
    }).then(({})=>{
      // If we have joined the match, we still have to tell the web server
      // TODO: invent a better way to handle this!!!!!

      let formData = new FormData();
      formData.append('mid', mid);
      formData.append('iso', iso);
      formData.append('username', username);

      fetch("/matches/join", {
          // headers: {
          //   'Accept': 'application/json',
          //   'Content-Type': "multipart/form-data"//'application/x-www-form-urlencoded; charset=utf-8'
          // },
          method: "POST",
          body: formData
      }).then(function(res){ 
        // refresh
        //window.location = '/';
      });
    });
  }

  join({mid, username, iso}) {
    // todo: fixme: refresh map with user info
    window.location = '/client';
    

    console.log(mid, username, iso)
    // gui.$refs.matches.matches[match.mid]
    // gui.$refs.matches.matches.push(match);
  }

  request_leave() {
    this.client.request("Matches:leave", {}).then(({})=>{
    });
  }

  leave({uid, iso}) {
    console.log("LEAVE", uid, iso);
  }
}