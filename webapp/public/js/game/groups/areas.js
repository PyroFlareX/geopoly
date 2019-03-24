import {moveUnits, setUnits, clearUnits, conquer} from '/js/ol/gfx.js';
import {match, EVENT} from "/js/game/store.js";

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

    match.events.push({
      "type": EVENT.MOVE,
      "iso": iso,
      "np": len(match.isos),
      "round": match.rounds,
    });
  }

  battle({from_id, to_id, iso, patch, new_patch, escape_patch, move_left, att_win, rep_from, rep_to}) {
    let def_esc = bool(escape_patch);

    if (att_win) {
      // attacker won

      // todo: @temporal:
      clearUnits(to_id);

      if (def_esc) {
        console.error("TODO: defender escape!!!", escape_patch);
        //removeCasualties(to_id, rep_to);
      }

      // move attacker to target
      conquer(to_id, iso);
      moveUnits(from_id, to_id, patch, move_left);

      // and now remove the casualties 
      setUnits(to_id, new_patch);

    } else {
      if (att_win)
        console.error("att win && def_esc can't happen!!");

      // defender won, we just remove units from the two sides

    }
  }
}