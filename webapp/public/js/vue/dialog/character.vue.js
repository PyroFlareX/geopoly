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
          <div class="modal-body bg-black text-white scroll" style="background: black">

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

            <div class="row">
              <div class="col">

                <small class="small">Age:</small><br/>
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="inputGroup-sizing-default">{{ age }}</span>
                  </div>
                  <input v-model.number="age" min="16" max="80" step="1" type="range" class="custom-range" aria-describedby="inputGroup-sizing-default" />
                </div>

              </div>
              <div class="col">
                <small class="small">Name:</small><br/>
                <input v-model="name" class="form-control" placeholder="Name of your hero" />
              </div>

              <div class="col">
                <button @click="onSubmit" class="btn btn-danger">Save</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
 </div>
`;