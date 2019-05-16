export const template = `
  <div v-if="show" class="infobar">
    <div class="infobar-header" :style="area_background(area)">
      <div class="shield shield-inline shield-xs shield-box" :style="herald(area)"></div>

      {{area.name}}

      <button type="button" class="close" aria-label="Close" v-on:click="show=false">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="infobar-content p-2" :area-id="area.id">      
      <div class="d-flex h-100">
        <div class="p-2 justify-content-center align-self-center">
          <button @click="onShiftFort" class="btn btn-danger">
            <i class="ra ra-icon-arrow-left"></i>
          </button>
        </div>
        <div class="p-2">
          <i class="ra ra-2x ra-action-garrison"></i>

          <div @click="switchTeam(unit)" class="garrison-box pointer" v-for="unit in units_in" v-b-tooltip.html :title="unit.get('name') + '<br/>♥️ '+Math.round(unit.get('health'))">
            <i :class="'ra ra-lg ra-unit-' + units[unit.get('prof')].name.lower()"></i>
          </div>

          <div class="garrison-box" v-for="i in (9-units_in.length)">
            <i class="ra ra-lg ra-icon-none"></i>
          </div>
        </div>
        <div class="p-2">
          <i class="ra ra-2x ra-unit-hero"></i>

          <div @click="switchTeam(unit)" class="garrison-box pointer" v-for="unit in units_out" v-b-tooltip.html :title="unit.get('name') + '<br/>♥️ '+Math.round(unit.get('health'))">
            <i :class="'ra ra-lg ra-unit-' + units[unit.get('prof')].name.lower()"></i>
          </div>

          <div class="garrison-box" v-for="i in (9-units_out.length)">
            <i class="ra ra-lg ra-icon-none"></i>
          </div>
        </div>
        <div class="p-2 justify-content-center align-self-center">
          <button @click="onShiftTeam" class="btn btn-danger">
            <i class="ra ra-icon-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>

  </div>
`;