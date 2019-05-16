export const template = `
  <div v-if="show" class="infobar infobar-lg">
    <div class="infobar-header" :style="area_background(area)">
      <div class="shield shield-inline shield-xs shield-box" :style="herald(area)"></div>

      {{area.name}}

      <button type="button" class="close" aria-label="Close" v-on:click="show=false">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="infobar-content p-2" :area-id="area.id">
      Team view
    </div>
  </div>
`;