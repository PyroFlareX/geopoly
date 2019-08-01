import {AreasController} from '/js/controllers/areas.js';
import {WorldsController} from '/js/controllers/worlds.js';

export const client = {
  controllers: {
    Areas: new AreasController(),
    Worlds: new WorldsController(),
  }
};
