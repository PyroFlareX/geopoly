
export const template = `
<div v-if="show">
  <div class="modal" style="display: block">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Select map</h5>

          <button type="button" class="close" aria-label="Close" v-on:click="show=false">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">

          <ul class="list-group">
            <li @click="onSelect(map_id)" class="list-group-item pointer" v-for="(map,map_id) in maps">
              {{map.name}}, {{map.year}} [3-{{map.max_players}} players]
            </li>
          </ul>

        </div>
      </div>
    </div>
  </div>
</div>
`;