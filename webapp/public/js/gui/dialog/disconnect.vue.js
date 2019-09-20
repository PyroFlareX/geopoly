
export const template = `
<div v-if="show">
  <div class="modal" style="display: block">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          Disconnected from server
        </div>
        <div class="modal-body">
          <div v-if="status == 'failed'">
            <strong>Couldn't reconnect to the server.</strong> Check if your internet is working. Try reloading the page or contact us.
          </div>
          <div v-else-if="status == 'reconnect'">
            <strong>Connecting to the server...</strong>

            <span>Attempt #{{ attempts }}</span>
          </div>
          <div v-else-if="status == 'success'">
            <strong class="text-success">Successfully reconnected!</strong>
          </div>
          <div v-else>
            Disconnected.
          </div>

          <br/>
          <br/>
          <div>
            <button @click="onQuit" class="btn btn-secondary btn-block">Quit world</button>
          </div>

        </div>
      </div>
    </div>
  </div>
</div>
`;