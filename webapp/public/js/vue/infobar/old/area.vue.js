export const template = `
  <div v-if="show" class="infobar infobar-lg">
    <div class="infobar-header" :style="area_background(area)">
      
      <div :class="'flag flag-inline flag-xs flag-'+area.iso"></div> {{area.name}}

      <button type="button" class="close" aria-label="Close" v-on:click="show=false">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="infobar-content p-2" :area-id="area.id">


      <div class="row row-nopad">
        <div class="col col-nopad">
          <p class="text-center"> <span class="ra ra-2x ra-class-infantry"></span> </p>

          <div v-for="u in UNITS_INF" :id="u" class="input-group mb-1">
            <div class="input-group-prepend">
              <span class="input-group-text" :id="u+'a'">
                <span :class="'ra ra-2x ra-unit-'+u"></span>
              </span>
            </div>

            <span class="form-control input-2x">{{ area[u] || 0 }}</span>
          </div>

        </div>
        <div class="col col-nopad">
          <p class="text-center"> <span class="ra ra-2x ra-class-cavalry"></span> </p>

          <div v-for="u in UNITS_CAV" :id="u" class="input-group mb-1">
            <div class="input-group-prepend">
              <span class="input-group-text" :id="u+'a'">
                <span :class="'ra ra-2x ra-unit-'+u"></span>
              </span>
            </div>

            <span class="form-control input-2x">{{ area[u] || 0 }}</span>
          </div>

        </div>
        <div class="col col-nopad">
          <p class="text-center"> <span class="ra ra-2x ra-class-artillery"></span> </p>

          <div v-for="u in UNITS_ART" :id="u" class="input-group mb-1">
            <div class="input-group-prepend">
              <span class="input-group-text" :id="u+'a'">
                <span :class="'ra ra-2x ra-unit-'+u"></span>
              </span>
            </div>

            <span class="form-control input-2x">{{ area[u] || 0 }}</span>
          </div>

        </div>
      </div>
      
    </div>
  </div>
`;