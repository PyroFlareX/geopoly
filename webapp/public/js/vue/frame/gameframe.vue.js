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
    </div>

  </div>
`;