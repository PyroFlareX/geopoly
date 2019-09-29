export const template = `
  <div v-if="world && world.me" >
    <div v-if="world.me" class="gui-corner-left-wrapper">
      <div class="gui-corner-left" @click="onClickFlag">
        <div class="glass"></div>

        <!-- use this for coats of arms: -->
        <!--<div class="flag-wrap">
          <div class="flag-shield" :style="herald(world.me)"></div>
        </div>-->

        <div class="flag-wrap">
          <div :class="'flag flag-'+world.me"></div>
        </div>
      </div>
    </div>

    <div class="gui-corner-right-wrapper">
      <div class="gui-corner-right" @click="onClickSeason">
        <div class="glass"></div>
        <div class="season-wrap">
          <div :class="'season season-' + season">
            <span class="year-text">{{ gameyear }}</span>

            <span class="day-text">{{ gamedate }}</span>
          </div>
        </div>
      </div>


      <div title="" @click="open_infobar('countries')" class="gui-corner-icon tilt-0">
        <i class="ra icon-ra ra-icon-player"></i>
      </div>

      <div title="" class="gui-corner-icon tilt-22_5">
      </div>

      <div title="" class="gui-corner-icon tilt-45">
      </div>

      <div title="Map settings"  @click="open_dialog('settings')" class="gui-corner-icon tilt-67_5">
        <i class="ra icon-ra ra-icon-settings"></i>
      </div>

      <div title="Surrender" @click="exit" class="gui-corner-icon tilt-90">
        <i class="ra icon-ra ra-icon-exit"></i>
      </div>
    </div>

  </div>
`;