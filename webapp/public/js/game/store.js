
/**
 * Store
 *
 * Provides a full cache for backend's data model
 */

export const store = new (class {

  constructor() {
    fetch('/js/game/rules.json').then((resp) => {
      return resp.json();
    }).then((resp) => {
      this.rules = resp;
    });
  }
});
