import {moveUnits} from '/js/ol/gfx.js';

export class AreasGroup {
  constructor(client) {
    this.client = client;
  }

  request_move(fromId, toId, patch) {

    this.client.request('Areas:move', {
      from: fromId, 
      to: toId,
      patch: patch
    }).then(function() {
      
    });
  }

  move({from, to, patch}) {
    console.info("%cMove: "+from.id+' > '+to.id, "color: white; background: blue");

    moveUnits(from, to, patch, -1);
  }
}