export const template = `
  <div v-if="show" class="infobar">
    <div class="infobar-header" :style="area_background(to)">
      Move from {{from.name}} to {{to.name}}

      <button type="button" class="close" aria-label="Close" v-on:click="show=false">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="infobar-content p-2" :area-id="from.id" :to-id="to.id">
      {{ from.iso }}
      {{ to.iso }}
      {{ rnd }}
    </div>
  </div>
`;