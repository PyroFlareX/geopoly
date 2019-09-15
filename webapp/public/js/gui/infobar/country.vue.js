
export const template = `
  <div v-if="show" class="infobar infobar-lg font-oldie">
    <div class="infobar-header" :style="area_background(country)">
      <div :class="'flag flag-inline flag-xs flag-box flag-'+country.iso"></div>

      {{ country.name }}

      <button type="button" class="close" aria-label="Close" @click="$emit('close')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="infobar-content p-2" :country-iso="country.iso">
      <div v-if="country.username">
        <div class="rank-box">
          <i :class="'ra ra-2x ra-rank-'+country.division"></i>
        </div>

        <strong :style="area_color(country)">{{ country.username }}</strong></p>
      </div>
      <div v-else>
        <p class="small">No player</p>
      </div>

      <div class="d-flex">
        <div class="flex-fill">
          <div>
            <i class="ra ra-2x ra-shadow ra-shadow ra-res-gold"></i> {{ country.gold }} (+{{ country.stats.income }})
          </div>
          <div>
            <i class="ra ra-2x ra-res-pop"></i> {{ country.pop }}
          </div>

        </div>
        <div class="flex-fill">
          <div>
            <i class="ra ra-2x ra-shadow ra-res-shield"></i> {{ country.shields }}
          </div>
          <div>
            <i class="ra ra-2x ra-shadow ra-icon-conquer"></i> {{ country.stats.conquers }} (-{{ country.stats.losses }})
          </div>
        </div>
      </div>

    </div>
  </div>
`;