
export class UnitsController {
  constructor(client) {
    this.client = client;
  }

  request_move(move_path, unit_ids) {
    let formData = new FormData();
    formData.append('path', JSON.stringify(move_path));
    formData.append('units', JSON.stringify(unit_ids));

    fetch('/units/move', {
      method: "PATCH",
      body: formData
    })
    .then((resp) => { return resp.json() })
    .then(function() {
      // ok
    });
  }
}