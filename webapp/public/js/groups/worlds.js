
export class WorldsGroup {
  constructor(ws) {
    this.ws = ws;
  }

  request_end_turn() {
    this.ws.request('Worlds:end_turn', {});
  }

  request_leave() {
    this.ws.request('Worlds:leave', {});
  }
}