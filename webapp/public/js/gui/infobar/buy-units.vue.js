import {component as build_dialog} from '/engine/modules/building/gui/build-catalog.js';


export const template = `
  <div v-if="show" class="infobar infobar-lg font-oldie">
    <div class="infobar-header" :style="area_background(area)">
      <div :class="'flag flag-inline flag-xs flag-box flag-'+area.iso"></div>

      {{area.name}} - Recruit

      <button type="button" class="close" aria-label="Close" v-on:click="show=false">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="infobar-content p-2" :area-id="area.id">
      <p v-if="!area.unit"><strong>Buy soldier:</strong></p>
      <p v-else><strong>Replace <i :class="'ra ra-2x ra-unit-'+area.unit"></i> with:</strong></p>

      <build-catalog @buy="onBuy" item_slot="unit" col_size.number="4" :parent="world" :entity="area"></build-catalog>
    </div>
  </div>
`;