export const template = `
<div v-if="show">

  <div class="popover fade show bs-popover-top" role="tooltip" x-placement="right">
    <div class="popover-header">
      <div :class="'flag flag-inline flag-xs flag-box flag-'+country.iso"></div>

      {{country.name}}

      <button type="button" class="close" aria-label="Close" v-on:click="show=false">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>

    <div class="popover-body">
      yololo ka
    </div>
  </div>

</div>
`;