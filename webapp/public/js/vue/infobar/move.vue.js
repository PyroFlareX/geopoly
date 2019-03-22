export const template = `
  <div v-if="show" class="infobar infobar-lg">
    <div class="infobar-header" :style="area_background(to)">
      Move from {{from.name}} to {{to.name}}

      <button type="button" class="close" aria-label="Close" v-on:click="close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="infobar-content p-2" :area-id="from.id" :to-id="to.id" :time="t">

      <div class="row row-nopad">
        <div class="col col-nopad">
          <p class="text-center"> <span class="ra ra-2x ra-class-infantry"></span> </p>

          <div v-for="u in UNITS_INF" :id="u" class="input-group mb-1">
            <div v-on:click="toggle(u)" class="input-group-prepend pointer">
              <span class="input-group-text" :id="u+'a'">
                <span :class="'ra ra-2x ra-unit-'+u"></span>
              </span>
            </div>
            <input type="number" v-model="patch[u]" @focus="$event.target.select()" min="0" :max="from[u]" :class="'form-control input-2x ' + (patch[u]>from[u]?'is-invalid':'')" placeholder="<<unit name>>" aria-label="unit number" :aria-describedby="u+'a'">
          </div>

        </div>
        <div class="col col-nopad">
          <p class="text-center"> <span class="ra ra-2x ra-class-cavalry"></span> </p>

          <div v-for="u in UNITS_CAV" :id="u" class="input-group mb-1">
            <div v-on:click="toggle(u)" class="input-group-prepend pointer">
              <span class="input-group-text" :id="u+'a'">
                <span :class="'ra ra-2x ra-unit-'+u"></span>
              </span>
            </div>
            <input type="number" v-model="patch[u]" @focus="$event.target.select()" min="0" :max="from[u]" :class="'form-control input-2x ' + (patch[u]>from[u]?'is-invalid':'')" placeholder="<<unit name>>" aria-label="unit number" :aria-describedby="u+'a'">
          </div>

        </div>
        <div class="col col-nopad">
          <p class="text-center"> <span class="ra ra-2x ra-class-artillery"></span> </p>

          <div v-for="u in UNITS_ART" :id="u" class="input-group mb-1">
            <div v-on:click="toggle(u)" class="input-group-prepend pointer">
              <span class="input-group-text" :id="u+'a'">
                <span :class="'ra ra-2x ra-unit-'+u"></span>
              </span>
            </div>
            <input type="number" v-model="patch[u]" @focus="$event.target.select()" min="0" :max="from[u]" :class="'form-control input-2x ' + (patch[u]>from[u]?'is-invalid':'')" placeholder="<<unit name>>" aria-label="unit number" :aria-describedby="u+'a'">
          </div>

          <!-- last input group is for send button -->
          <div class="input-group mb-1">
            <button @click="onSubmit" class="btn btn-block btn-lg btn-danger">Move troops</button>
          </div>

        </div>
      </div>

    </div>
  </div>
`;