
export const template = `
  <div v-if="show" class="infobar infobar-lg font-oldie">
    <infobar-header :content="country.name" :iso="country.iso" infobar_id="country"></infobar-header>

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
            <i class="ra ra-2x ra-shadow ra-action-conquer"></i> {{ country.stats.conquers }} (-{{ country.stats.losses }})
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
              <i class="ra ra-lg ra-action-tribute"></i>
              <span style="color:#2e4e0a">Send</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
`;