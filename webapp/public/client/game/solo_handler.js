import {client} from '/client/websocket.js';
import {items} from '/engine/modules/building/building.js';

//let cli = client.ws;



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
      client.ws.onmessage(resp);
    break;
    case 'Game:buy':
      let item = items[params.item_id];
      resp.params.cost = {
        gold: item.cost_gold,
        pop: item.cost_pop
      };
      client.ws.onmessage(resp);
    break;
    //case 'Game:end_turn': client.ws.onmessage(resp); break;

    default: console.info(route, 'called with', params); break;

  }

}