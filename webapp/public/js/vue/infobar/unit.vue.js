export const template = `
  <div v-if="show" class="infobar">
    <div class="infobar-header" :style="area_background(unit)">
      <div class="shield shield-inline shield-xs shield-box" :style="herald(unit.iso)"></div>

      {{unit.name}}

      <button type="button" class="close" aria-label="Close" v-on:click="show=false">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="infobar-content p-2" :unit-id="unit.id">

      <div class="d-flex">
        <div class="p-2 flex-fill">
          <ul>
            <li>Aged {{ unit.age }}</li>
            <li>Born in ?, <div class="shield shield-inline shield-xs shield-box" :style="herald(unit)"></div> {{country.name}}
            </li>
            <li>{{ prof_name }}</li>
            <li>XP: {{ unit.xp }}</li>
          </ul>

          <p>Can travel {{ unit.move_left }} areas this turn.</p>
        </div>
        <div class="p-2">
          <div class="">
            <img class="image-box" :src="src_unit" style="min-height:100px; margin-left: 5px;margin-bottom: 8px" />

            <br/>

            <div class="progress">
              <div class="progress-bar bg-danger" role="progressbar" :style="'width: '+Math.round(unit.health)+'%'" :aria-valuenow="Math.round(unit.health)" aria-valuemin="0" aria-valuemax="100">
                <i class="ra ra-health"></i> {{Math.round(unit.health)}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;