export const template = `
<div v-if="show" id="flash">
  <div class="gui-flash-wrapper">
    <div class="gui-flash gui-text-bordeaux">
      <div v-if="country" class="shield shield-sm" :style="herald(country)"></div> <p :class="'text-'+theme">{{ text }}</p>
    </div>
  </div>
</div>
`;