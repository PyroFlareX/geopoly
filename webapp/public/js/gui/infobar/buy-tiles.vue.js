import {component as build_dialog} from '/engine/modules/building/gui/build-catalog.js';


export const template = `
  <div v-if="show" class="infobar infobar-lg font-oldie">
    <div class="infobar-header" :style="area_background(area)">
      <div :class="'flag flag-inline flag-xs flag-box flag-'+area.iso"></div>

      {{area.name}} - Build

      <button type="button" class="close" aria-label="Close" @click="$emit('close')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="infobar-content p-2" :area-id="area.id">
      <strong>Build area:</strong>

      <build-catalog @buy="onBuy" item_slot="tile" col_size.number="4" :parent="country" :entity="area"></build-catalog>
    </div>
  </div>
`;