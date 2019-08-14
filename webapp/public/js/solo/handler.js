
export class SoloHandler {

  request(route, params) {
    route = route.replace(":", "_");

    if (this[route])
      this[route](params);

    console.info(route, 'called with', params);
  }
}