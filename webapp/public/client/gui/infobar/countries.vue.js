
export const template = `
  <div v-if="show" class="infobar infobar-lg">
    <infobar-header content="Countries" infobar_id="countries"></infobar-header>
    
    <div class="infobar-content font-oldie p-2">

      <table class="table table-borderless table-hover table-sm text-center">
        <thead>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td><i class="ra ra-2x ra-shadow ra-shadow ra-res-gold"></i></td>
            <td><i class="ra ra-2x ra-res-pop"></i></td>
            <td><i class="ra ra-2x ra-shadow ra-res-shield"></i></td>
            <td><i class="ra ra-2x ra-shadow ra-icon-conquer"></i></td>
          </tr>
        </thead>
        <tbody>
          <tr @click="open_infobar('country', country)" v-for="(country, iso) in countries" :class="{'pointer': true, 'table-active': world.current == iso, 'strikeout': country.shields <= 0}">
            <td>
              <i v-if="world.current == iso" class="ra ra-lg ra-shadow ra-icon-current"></i>
            </td>
            <td>
              <div :class="'flag flag-xs pointer flag-box flag-'+iso+(country.shields <=0?' flag-unclaimed':'')" v-b-popover.hover.top="country.name" ></div>
            </td>
            <td>
              <i v-if="country.emperor" class="ra ra-2x ra-shadow ra-icon-emperor"></i>
              <i v-else-if="max_conquers > 0 && max_conquers == country.stats.conquers" class="ra ra-2x ra-shadow ra-icon-topscore"></i>
            </td>
            <td>{{ country.gold }}</td>
            <td>{{ country.pop }}</td>
            <td>{{ country.shields }}</td>
            <td>{{ country.stats.conquers }}</td>
          </tr>
        </tbody>
      </table>

    </div>
  </div>
`;