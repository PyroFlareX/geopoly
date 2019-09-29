import {component as createWorld} from '/js/gui/component/world-hall.js';
import {component as listWorlds} from '/js/gui/component/list-worlds.js';

export const template = `
<div>
  <world-hall ref="world-hall" @leave="onLeave" @switch="onSwitch" @start="onStart" @setmap="setMap"></world-hall>

  <list-worlds @join="onJoin" @create="onCreate" ref="list-worlds"></list-worlds>
</div>
`;