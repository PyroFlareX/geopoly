
export const template = `
<div v-if="show">
  <div class="modal" style="display: block">
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Join match</h5>

          <button type="button" class="close" aria-label="Close" v-on:click="show=false">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body scroll" :style="maxHeight">

          <h1 class="text-center text-black font-brand">Welcome to Geopoly!</h1>

          <div class="text-center">
            <p>You have chosen to play as:</p>

            <div :class="'m-auto flag flag-md flag-' + country.iso"></div>
            <br />

            <h3 class="text-center text-black font-brand">{{ country.name }}</h3>
            <p>You'll be placing your capital at {{ area.name }}</p>
          </div>

          <hr />

          <div class="text-center">
            <p>Pick your username:</p>
            <div class="form-group">
              <input type="text" v-model="username" class="form-control" />
            </div>

            <p>Select your army deck to place:</p>

            <div class="form-group">
              <select v-model="deck" class="form-control">
                <option :value="deck0.did" v-for="deck0 in decks">{{ deck0.name }}</option>
              </select>
            </div>

            <br />

            <button @click="onSubmit" class="btn btn-block btn-lg btn-danger">Start playing</button>
          </div>

        </div>
      </div>
    </div>
  </div>
</div>
`;