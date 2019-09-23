
export const template = `
  <div v-if="show" class="infobar infobar-lg font-oldie">
    <div @mousedown="infobar_mousedown" @mouseup="infobar_mouseup" @mousemove="infobar_mousemove" class="infobar-header" :style="area_background(country)">
      <div :class="'flag flag-inline flag-xs flag-box flag-'+country.iso"></div>

      {{ country.name }}

      <button type="button" class="close" aria-label="Close" @click="$emit('close')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="infobar-content p-2" :country-iso="country.iso">

      <div class="d-flex">
        <div class="flex-fill">
          <!-- Economy -->
          <div>
            <i class="ra ra-2x ra-shadow ra-shadow ra-res-gold"></i> {{ country.gold }} (+{{ country.stats.income }})
          </div>
          <div>
            <i class="ra ra-2x ra-res-pop"></i> {{ country.pop }}
          </div>
          <div>
            <i class="ra ra-2x ra-shadow ra-res-shield"></i> {{ country.shields }}
          </div>
          <div>
            <i class="ra ra-2x ra-shadow ra-icon-conquer"></i> {{ country.stats.conquers }} (-{{ country.stats.losses }})
          </div>

        </div>
        <div class="flex-fill">
          <!-- Player -->
          <div v-if="country.username">
            <div class="rank-box">
              <i :class="'ra ra-2x ra-rank-'+country.division"></i>
            </div>

            <strong :style="area_color(country)">{{ country.username }}</strong>
          </div>
          <div v-else>
            <p class="small">No player</p>
          </div>
        </div>
      </div>

      <hr />

      <!-- Send tribute -->
      <div class="form-group">
        <p class="small">Send Tribute:</p>

        <div class="input-group">
          <input type="text" class="form-control" style="max-width: 100px;" v-model.number="tribute" placeholder="Tribute amount">

          <div class="input-group-append">
            <button @click="onTribute" class="btn btn-outline-success" type="button">
              <i class="ra ra-lg ra-icon-tribute"></i>
              <span style="color:#2e4e0a">Send</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
`;