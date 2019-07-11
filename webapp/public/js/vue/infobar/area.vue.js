export const template = `
  <div v-if="show" class="infobar">
    <div class="infobar-header" :style="area_background(area)">
      <div class="shield shield-inline shield-xs shield-box" :style="herald(area)"></div>

      {{area.name}}

      <button type="button" class="close" aria-label="Close" v-on:click="show=false">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="infobar-content p-2" :area-id="area.id">

      <div class="d-flex">
        <div class="p-2 flex-fill">

          <div v-if="area.castle > 0">
            <p>
              <i :class="'ra ra-castle-' + area.castle"></i> <strong>
                <u v-if="area.castle == 1">Tower</u>
                <u v-if="area.castle == 2">City</u>
                <u v-if="area.castle == 3">Castle</u>
                <u v-if="area.castle == 4">Citadel</u>

                (Lvl {{area.castle}})
              </strong>
            </p>
            
            <button class="btn btn-link" @click="open_infobar('training', area)">Training</button><br/>
            <button class="btn btn-link" @click="open_infobar('team', area)">Armies</button><br/>
            <button class="btn btn-link" @click="open_infobar('building', area)">Upgrade</button>
          </div>
          <div v-else>
            <p>
              <i class="ra ra-field"></i> Province
            </p>

            <button class="btn btn-link" @click="open_infobar('building', area)">Build here</button>
          </div>
        </div>
        <div class="p-2">
          <h3>{{country.name}}</h3>

          <div class="mx-auto shield shield shield-box" :style="herald(area)"></div>

        </div>
      </div>

    </div>
  </div>
`;