import {moveUnits, conquer} from '/js/ol/gfx.js';

export class AreasGroup {
  constructor(client) {
    this.client = client;
  }

  request_move(fromId, toId, patch) {

    this.client.request('Areas:move', {
      from_id: fromId, 
      to_id: toId,
      patch: patch
    }).then(function() {
      
    });
  }

  move({from_id, to_id, iso, move_left, patch, err}) {
    if (err) {
      // todo: gui flash
      console.error("can't move", err);
      return;
    }

    console.info("%cMove: "+from_id+' > '+to_id, "color: white; background: blue");

    conquer(to_id, iso);
    moveUnits(from_id, to_id, patch, move_left);
  }
}