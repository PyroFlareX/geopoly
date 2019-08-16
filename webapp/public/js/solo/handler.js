import {ws_client} from '/engine/modules/websocket/wsclient.js';

let cli = ws_client;

export function offline_request(route, params) {
  const resp = {
    data: JSON.stringify({
      route: route,
      params: params
    })
  };

  switch(route) {

    case 'Areas:move': cli.onmessage(resp); break;

    

    default: console.info(route, 'called with', params); break;

  }

}