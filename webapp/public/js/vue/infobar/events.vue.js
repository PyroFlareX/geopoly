export const template = `
  <div v-if="show" class="infobar">
    <div class="infobar-header">

      Recent events 

      <button type="button" class="close" aria-label="Close" v-on:click="show=false">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="infobar-content p-2">
      <div class="scroll" :style="maxHeight">
        <table class="table table-condensed table-striped">
          <!--<thead>
            <tr>
              <th>At</th><th>Event</th><th>Countries</th><th>Location</th>
            </tr>
          </thead>-->
          <tbody>
            <tr v-for="event in match.events">
              <td>
                <div v-if="event.iso" :class="['flag','flag-inline','flag-xs','flag-'+event.iso, 'pointer']" v-on:click="onClickCountry(event.iso)"></div> 
              </td>
              <td>{{ todate(event) }}</td>
              <td>{{ getType(event.type) }}</td>
              
              <!--(event.geom[0], event.geom[1])
              <td class="pointer" v-on:click="onClickCoord(event)"></td>
              -->
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
`;