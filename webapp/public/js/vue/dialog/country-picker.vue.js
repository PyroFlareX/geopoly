export const template = `
  <div v-if="show">
    <div class="modal" style="display: block">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title">Select country</h5>

            <button type="button" class="close" aria-label="Close" v-on:click="show=false">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body scroll">


            <div class="row">
              <div class="col-lg-2 col-md-3 col-sm-4 col-xs-6 pointer" v-for="(country,iso) in countries" @click="onClicked(iso)">

                <div>
                  <div :class="{'shield shield-inline shield-md shield-box':true, 'pointer': select != iso, 'active': select == iso}" :style="herald(iso)"></div>

                  <div></div>

                  <h5 class="card-title">{{ country.name }}</h5>
                  <p v-if="country.description">{{ country.description }}</p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
 </div>
`;
