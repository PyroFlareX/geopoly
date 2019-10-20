import {component as build_dialog} from '/engine/modules/building/gui/build-catalog.js';


export const template = `
  <div v-if="show" class="infobar infobar-lg font-oldie">
    <infobar-header :content="area.name + ' - info'" :iso="area.iso" infobar_id="area"></infobar-header>

    <div class="infobar-content p-2" :area-id="area.id">

      <div class="d-flex">
        <div class="flex-fill">
          <p v-if="area.unit">
            <span :class="'ra ra-lg ra-unit-'+area.unit"></span> {{ item_name(area.unit) }}

            <br/>
            <strong v-if="area.unit && area.exhaust" class="small">Exhausted for {{ area.exhaust }} rounds.</strong>
          </p>
          <p v-if="area.build">
            <span :class="'ra ra-lg ra-build-'+area.build"></span> {{ item_name(area.build) }}
          </p>
          <p v-if="area.tile">
            <span :class="'ra ra-lg ra-tile-'+area.tile"></span> {{ item_name(area.tile) }}
          </p>

        </div>
        <div class="flex-fill">
          <p v-if="country"> 
            <span @click="open_infobar('country', country)" :class="'flag flag-xs border border-dark rounded pointer flag-'+country.iso"></span> {{ country.name }}

            <br />
            <strong v-if="country.username">({{ country.username }})</strong>
          </p>

          <p v-if="area.iso2 && area.iso != area.iso2">Was annexed from <span :class="'flag flag-xs border border-dark rounded flag-'+area.iso2"></span></p>

        </div>
      </div>
    </div>
  </div>
`;