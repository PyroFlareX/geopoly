export const template = `
  <div>
    <div v-if="world.me" class="gui-corner-left-wrapper">
      <div class="gui-corner-left" @click="onClickFlag">
        <div class="glass"></div>
        <div class="flag-wrap">
          <div class="flag-shield" :style="herald(world.me)"></div>
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

      <div title="Players" @click="open_dialog('players')" class="gui-corner-icon tilt-0">
        <i class="ra icon-ra ra-icon-player"></i>
      </div>

      <div title="Events" @click="open_infobar('events')" class="gui-corner-icon tilt-22_5">
        <i class="ra icon-ra ra-icon-info"></i>
      </div>

      <div title="Map settings" @click="open_dialog('settings')" class="gui-corner-icon tilt-45">
        <i class="ra icon-ra ra-icon-settings"></i>
      </div>

      <div title="" @click="" class="gui-corner-icon tilt-67_5">
        <i class="ra icon-ra ra-icon-mute"></i>
      </div>

      <div title="" @click="exit" class="gui-corner-icon tilt-90">
        <i class="ra icon-ra ra-icon-exit"></i>
      </div>
    </div>


    <div class="units-bar" v-if="team">
      <div class="d-flex flex-row">
        <div @click="open_infobar('unit', unit)" class="pointer unit-box text-center p-2" :style="unit_background(unit)" v-for="unit in team" >


          <img class="img-fluid" :src="src_unit(unit)" style="min-height:75px" />

          <i :class="'ra ra-lg ra-unit-' + units[unit.get('prof')].name.lower()" style="position: absolute; top: 70px"></i>
        </div>
      </div>      
    </div>

  </div>
`;