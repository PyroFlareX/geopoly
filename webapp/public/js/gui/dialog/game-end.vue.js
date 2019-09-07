
export const template = `
<div v-if="show">
  <div class="modal" style="display: block">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header" :style="area_background(winner)">
          <div :class="'flag flag-inline flag-sm flag-box flag-'+winner"></div>

          <h1 class="modal-title" v-if="world.me == winner">Victory!</h1>
          <h1 class="modal-title" v-else>Defeat!</h1>

          <div :class="'flag flag-inline flag-sm flag-box flag-'+winner"></div>
        </div>
        <div class="modal-body">

          <div v-if="world.me == winner">
            <h5>Congratulations!</h5>

            <p>You have won this game!</p>
          </div>

          <div>
            <table class="table table-borderless table-hover table-sm">
              <tbody>
                <tr v-for="(country, iso) in countries" :class="{'bg-secondary': winner == iso}">
                  <td><div :class="'flag flag-xs pointer flag-box flag-'+iso"></div></td>
                  <td><i class="ra ra-2x ra-shadow ra-res-gold"></i> {{ country.gold }}</td>
                  <td><i class="ra ra-2x ra-res-pop"></i> {{ country.pop }}</td>
                  <td><i class="ra ra-2x ra-shadow ra-res-shield"></i> {{ country.shields }}</td>
                </tr>
              </tbody>
            </table>

            <p>The game has ended. Winner: {{ countries[winner].name }}</p>
          </div>

          <div>
            <button @click="onClick"  :style="area_background(winner)" class="btn btn-block">Continue</button>
          </div>

        </div>
      </div>
    </div>
  </div>
</div>
`;