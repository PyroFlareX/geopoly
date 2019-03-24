export const template = `
  <div v-if="show" class="infobar">
    <div class="infobar-header" :style="area_background(area)">
      
      <div :class="'flag flag-inline flag-xs flag-'+area.iso"></div> {{area.name}}

      <button type="button" class="close" aria-label="Close" v-on:click="show=false">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="infobar-content p-2" :area-id="area.id">
      {{ area.iso }}
      
    </div>
  </div>
`;