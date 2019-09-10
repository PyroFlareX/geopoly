
export const template = `
  <div v-if="show" class="infobar infobar-lg font-oldie">
    <div class="infobar-header" :style="area_background(area)">
      <div :class="'flag flag-inline flag-xs flag-box flag-'+area.iso"></div>

      Movement
      <button type="button" class="close" aria-label="Close" @click="$emit('close')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="infobar-content p-2" :area-id="area.id">
      <p>Move <span v-if="area">{{area.name}}</span> -> <span v-if="to_area">{{to_area.name}}</span></p>

      <p class="text-danger">
        <strong v-if="act == 'attack'">You can attack {{to_area.name}}</strong>
        <strong v-else-if="act == 'capture'">You can capture the city of {{to_area.name}}</strong>
        <strong v-else-if="act == 'claim'">You can claim {{to_area.name}}</strong>
        <strong v-else-if="act == 'move'">You can move here.</strong>
      </p>
    </div>
  </div>
`;