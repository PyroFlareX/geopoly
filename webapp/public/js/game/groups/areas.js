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
    moveUnits(from, to, patch, -1);
  }
}