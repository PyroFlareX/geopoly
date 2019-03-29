export const template = `
<div v-if="show">
  <div class="modal" style="display: block">
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Match</h5>

          <button type="button" class="close" aria-label="Close" v-on:click="show=false">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          murrrrrr

        </div>
      </div>
    </div>
  </div>
</div>
`;