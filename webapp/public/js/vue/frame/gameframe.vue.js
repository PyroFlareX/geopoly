export const template = `
  <div>
    <div class="gui-corner-left-wrapper">
      <div class="gui-corner-left" v-on:click="onClickFlag()">
        <div class="glass"></div>
        <div class="flag-wrap">

          <div :class="'flag flag-LG flag-' + country.iso"></div>

        </div>
      </div>
    </div>
  </div>
`;