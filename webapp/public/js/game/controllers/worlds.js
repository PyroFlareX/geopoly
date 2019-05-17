
export class WorldsController {
  constructor(client) {
    this.client = client;
  }

  request_find(iso, name, age, weights) {
    let formData = new FormData();
    formData.append('iso', iso);
    formData.append('name', name);
    formData.append('age', age);
    formData.append('weights', JSON.stringify(weights));

    fetch('/worlds/player', {
      method: "POST",
      body: formData
    })
    .then((resp) => { return resp.json() })
    .then(function(resp) {
      if (resp.err == 'area_not_found') {
        alert("Could not find an empty castle in this country. Please try with another one");
        return;
      }

      // ok
      window.location = '/';
    });
  }
}