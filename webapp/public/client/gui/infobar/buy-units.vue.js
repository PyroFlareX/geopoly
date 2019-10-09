import {component as build_dialog} from '/engine/modules/building/gui/build-catalog.js';


export const template = `
  <div v-if="show" class="infobar infobar-lg font-oldie">
    <infobar-header :content="area.name + ' - buy'" :iso="area.iso" infobar_id="buy-units"></infobar-header>

    <div class="infobar-content p-2" :area-id="area.id">
      <div>
        <strong>Buy soldier or building:</strong>
        
        <div class="float-right" :class="{'border border-dark rounded': true, 'bg-danger': sacrifice, 'pointer': country.shields > 1}">
          <span @click="if (country.shields > 1) sacrifice=!sacrifice" class="ra ra-2x ra-action-sacrifice">
            <span class="path1"></span>
            <span class="path2"></span>
          </span>
        </div>
      </div>

      <build-catalog @buy="onBuy" item_slot="unit" col_size.number="4" :parent="country" :entity="area"></build-catalog>

      <build-catalog @buy="onBuy" item_slot="build" col_size.number="4" :parent="country" :entity="area"></build-catalog>

    </div>
  </div>
`;