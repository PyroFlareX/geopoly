export const template = `
  <div>
    <div class="gui-corner-left-wrapper">
      <div class="gui-corner-left" @click="onClickFlag">
        <div class="glass"></div>
        <div class="flag-wrap">

          <div :class="'flag flag-LG flag-' + iso"></div>

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

      <div title="Players" @click="dialog('players')" class="gui-corner-icon tilt-0">
        <i class="ra icon-ra ra-icon-players"></i>
      </div>

      <div title="" @click="" class="gui-corner-icon tilt-22_5">
      </div>

      <div title="Map settings" @click="dialog('settings')" class="gui-corner-icon tilt-45">
        <i class="ra icon-ra ra-icon-layers"></i>
      </div>

      <div title="" @click="" class="gui-corner-icon tilt-67_5">
      </div>

      <div title="" @click="" class="gui-corner-icon tilt-90">
      </div>
    </div>

  </div>
`;