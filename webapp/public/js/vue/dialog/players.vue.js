
export const template = `
<div v-if="show">
  <div class="modal" style="display: block">
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Players</h5>

          <button type="button" class="close" aria-label="Close" v-on:click="show=false">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body scroll" :style="maxHeight">

          <div class="row">
            <div class="col-lg-2 col-md-3 col-sm-4 col-xs-6 pointer" v-for="country in countries" v-on:click="onClicked(country.iso)">

              <div>
                <span :class="'flag flag-md flag-inline flag-' + country.iso + (country.player.default?' flag-unclaimed':'')"></span>

                <div></div>

                <h5 class="card-title">{{ country.name }}</h5>
                <p v-if="country.player.name">{{ country.player.name }}</p>
              </div>

            </div>
          </div>


        </div>
      </div>
    </div>
  </div>
</div>
`;