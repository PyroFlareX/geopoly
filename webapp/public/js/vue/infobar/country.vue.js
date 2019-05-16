export const template = `
  <div v-if="show" class="infobar">
    <div class="infobar-header" :style="area_background(country)">
      <div class="shield shield-inline shield-xs shield-box" :style="herald(country)"></div>

      {{country.name}}

      <button type="button" class="close" aria-label="Close" v-on:click="show=false">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="infobar-content p-2" :country-id="country.id">
      Country infobar
    </div>
  </div>
`;