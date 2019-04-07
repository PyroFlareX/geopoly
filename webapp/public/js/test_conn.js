import {client} from '/js/game/client.js';

export function init_app(debug, ws_address, uid, token) {

  $("#debug").textContent = 'Connecting...';


  client.connect(ws_address, () => {
    $("#debug").textContent = 'Authenticating...';

    client.request("Users:guest", {uid: uid}).then(({user}) => {
      $("#debug").textContent = `Logged in! ${user.uid} ${user.username} ${user.iso} ${user.mid}`;
    });
  });

}