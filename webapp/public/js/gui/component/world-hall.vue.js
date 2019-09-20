export const template = `
<div v-if="show && world && map">

  <div class="container">
    <div class="row">
      <div class="col-8">
        <button @click="$emit('leave')" class="btn btn-danger">Quit</button>
        <button @click="$emit('start')" class="btn btn-danger">Start</button>

        <button @click="onSetMap('map_hu')" class="btn btn-info">Regen map</button>

        <br/>

        <p><strong>World name:</strong> {{ world.name }}</p>
        <p><strong>Max rounds:</strong> {{ world.max_rounds || '-' }}</p>

      </div>
      <div class="col-4">
        <div @click="onClickMap" class="pointer" id="app-minimap" style="min-height: 150px"></div>

        <p class="font-oldie"><strong>{{ map.name }} ({{ map.year }})</strong></p>
      </div>

    </div>

    <table class="table table-borderless">
      <tr v-for="iso in map.isos">
        <td>
          <div :class="'flag flag-sm flag-box flag-'+iso"></div>
        </td>
        <td v-if="world.players[iso]" >
          <i :class="'ra ra-2x ra-rank-'+world.players[iso].division"></i>
          <strong>{{ world.players[iso].username }}</strong>
        </td>
        <td v-else @click="$emit('switch', world.wid, iso)" class="pointer">
          <small class="text-grey"><i>Country available</i></small>
        </td>
      </tr>
    </table>
  </div>
</div>
`;