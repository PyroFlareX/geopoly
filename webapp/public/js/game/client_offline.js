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

  
});
