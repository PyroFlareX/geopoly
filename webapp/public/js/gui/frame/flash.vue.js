export const template = `
<div v-if="show" id="flash">
  <div class="gui-flash-wrapper">
    <div class="gui-flash">
      <div :class="'flag flag-inline flag-xs flag-'+iso"></div> 

      <span :class="'text-'+theme">{{ text }}</span>
    </div>
  </div>
</div>
`;