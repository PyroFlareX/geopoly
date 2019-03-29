
export const template = `
<div v-if="show">
  <div class="modal" style="display: block">
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Create match</h5>

          <button type="button" class="close" aria-label="Close" v-on:click="show=false">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">

          <select v-model.number="map" class="form-control">
            <option value="1">1853: Crimean War</option>
          </select>

          <div>Max players: {{ players[map] }}.</div>

          <div>
            <p>Max rounds:</p>

            <input class="form-control" min="20" max="300" v-model.number="max_rounds" type="number">
          </div>

          <button @click="onSubmit" class="btn btn-danger">Create</button>

        </div>
      </div>
    </div>
  </div>
</div>
`;