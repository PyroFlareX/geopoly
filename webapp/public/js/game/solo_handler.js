import {ws_client} from '/engine/modules/websocket/wsclient.js';
import {items} from '/engine/modules/building/building.js';

let cli = ws_client;



export function offline_request(route, params) {
  const resp = {
    route: route,
    params: params
  };

  switch(route) {

    case 'Game:move':
      resp.params.events = {
        conquer: false,
        kill: false
      };
      cli.onmessage(resp);
    break;
    case 'Game:buy':
      let item = items[params.item_id];
      resp.params.cost = {
        gold: item.cost_gold,
        pop: item.cost_pop
      };
      cli.onmessage(resp);
    break;
    //case 'Game:end_turn': cli.onmessage(resp); break;

    default: console.info(route, 'called with', params); break;

  }

}