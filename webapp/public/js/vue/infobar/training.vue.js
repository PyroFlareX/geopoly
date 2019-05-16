export const template = `
  <div v-if="show" class="infobar infobar-lg">
    <div class="infobar-header" :style="area_background(area)">
      <div class="shield shield-inline shield-xs shield-box" :style="herald(area)"></div>

      {{area.name}}

      <button type="button" class="close" aria-label="Close" v-on:click="show=false">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="infobar-content p-2" :area-id="area.id">
      <h3>Training: </h3>

      <div class="d-flex">
        <div class="p-2">

          <div @click="onClearTraining()" class="text-center card pointer">
            <div v-if="area.training !== null" class="card-body">
              <div class="text-center">
                <i :class="'ra ra-4x ra-unit-' + units[area.training].name.lower()"></i>
              </div>

              <p class="card-text"><b>{{ units[area.training].dispname }}</b><br/>
                <span>({{area.train_left}} {{area.train_left>1?'turns':'turn'}} left)</span>
              </p>
            </div>
          </div>

        </div>
        <div class="p-2 flex-fill">

          <div class="d-flex flex-wrap" style="width: 270px">
            <div v-for="unit_id in [0,1,4, 2,3,5]">

              <div @click="onSetTraining(units[unit_id])" class="text-center m-1 card pointer">
                <div class="card-body">
                  <div class="text-center">
                    <i :class="'ra ra-2x ra-unit-' + units[unit_id].name.lower()"></i>
                  </div>

                  <p class="card-text">{{ units[unit_id].train_turns }}</p>
                </div>
              </div>

              <br v-if="unit_id == 4" />

            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
`;