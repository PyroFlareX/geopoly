export const template = `
 <div v-if="show">

    <div class="modal" style="display: block">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title">Create new Character</h5>

            <button type="button" class="close" aria-label="Close" v-on:click="show=false">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body bg-black text-white scroll">


            <div v-if="status.is_ready" class="d-flex">
              <div class="p-2">

                <div class="text-center">
                  <img class="img-fluid" :src="src_weights" :id="'char-' + updates" style="min-height:200px" />
                </div>

                <div>
                  <button @click="randomize" class="btn btn-link">Randomize</button>
                </div>
                <div>
                  <button @click="hybridize" class="btn btn-link">Change slightly</button>
                </div>
                <hr />
                <div>
                  <button @click="onSubmit" class="btn btn-danger">Save and play</button>
                </div>

              </div>

              <div class="flex-fill p-2">
                <div v-for="i in variable" :id="'p'+i">
                  <input v-model.number="weights[i]" :min="lows[i]" :max="highs[i]" step="0.001" type="range" class="custom-range" />                
                </div>

              </div>
            </div>

            <div v-else>
              <p class="text-danger">Loading character creation...</p>
            </div>

          </div>
        </div>
      </div>
    </div>

 </div>
`;