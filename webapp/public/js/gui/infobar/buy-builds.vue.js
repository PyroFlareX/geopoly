import {component as build_dialog} from '/engine/modules/building/gui/build-catalog.js';


export const template = `
  <div v-if="show" class="infobar infobar-lg font-oldie">
    <div class="infobar-header" :style="area_background(area)">
      <div :class="'flag flag-inline flag-xs flag-box flag-'+area.iso"></div>

      {{area.name}} - Build

      <button type="button" class="close" aria-label="Close" v-on:click="show=false">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="infobar-content p-2" :area-id="area.id">
      <p v-if="!area.build"><strong>Buy Building:</strong></p>
      <p v-else><strong>Upgrade <i :class="'ra ra-2x ra-build-'+area.build"></i> to:</strong></p>

      <build-catalog item_slot="build" col_size.number="4" :parent="world" :entity="area"></build-catalog>
      <build-catalog item_slot="tile" col_size.number="4" :parent="world" :entity="area"></build-catalog>
    </div>
  </div>
`;