import {component as build_dialog} from '/engine/modules/building/gui/build-catalog.js';


export const template = `
  <div v-if="show" class="infobar infobar-lg font-oldie">
    <infobar-header :content="area.name + ' - build'" :iso="area.iso" infobar_id="buy-tiles"></infobar-header>

    <div class="infobar-content p-2" :area-id="area.id">
      <strong>Build area:</strong>

      <build-catalog @buy="onBuy" item_slot="tile" col_size.number="4" :parent="country" :entity="area"></build-catalog>
    </div>
  </div>
`;