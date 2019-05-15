
export class UnitsGroup {
  constructor(client) {
    this.client = client;
  }

  request_move(move_path, unit_ids) {
    console.log('MOVE', move_path, unit_ids)    
    // this.client.request('Areas:move', {
    //   from_id: fromId, 
    //   to_id: toId,
    //   patch: patch
    // }).then(function() {
      
    // });
  }
}