import {AreasGroup} from '/js/game/groups/areas.js';


export let client = new (class {
  constructor() {
    this.groups = {
      areas: new AreasGroup(this)
    }
  }

  group(name) {
    return this.groups[name];
  }

  request(route, params) {

    let test_json = JSON.stringify(params);
    console.log('<', route, test_json);

    // fake server
    setTimeout(() => {
    switch(route) {
      case 'Areas:move':
        client.groups.areas.move(params);

      break;
    }
    });

    return new DeferredResponse(route, params);
  }
});


var DeferredResponse = function(route, params) {
  this.then = function(callback) {
    callback();
  }
};
