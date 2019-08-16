
export const template = `
  <div v-if="show" class="infobar infobar-lg">
    <div class="infobar-header">
      Countries

      <button type="button" class="close" aria-label="Close" v-on:click="show=false">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="infobar-content font-oldie p-2">

      <table class="table table-borderless table-hover table-sm">
<!--         <thead>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </thead>
 -->        <tbody>
          <!--
         + country name (tooltip)
          - color in name: stroke
          -->
          <tr v-for="(country, iso) in countries" :class="'pointer'+ (world.current == iso ? ' bg-warning':'')">
            <td><div :class="'flag flag-xs pointer flag-box flag-'+iso"></div></td>
            <td><i class="ra ra-2x ra-shadow ra-res-gold"></i> {{ country.gold }}</td>
            <td><i class="ra ra-2x ra-res-pop"></i> {{ country.pop }}</td>
            <td><i class="ra ra-2x ra-shadow ra-res-shield"></i> {{ country.shields }}</td>
            <td>
              <i v-if="country.emperor" class="ra ra-2x ra-shadow ra-icon-emperor"></i>
              <i v-else-if="max_conquers > 0 && max_conquers == country.conquers" class="ra ra-2x ra-shadow ra-icon-topscore"></i>
            </td>
          </tr>
        </tbody>
      </table>

    </div>
  </div>
`;