
export const template = `
<div v-if="show">
  <div class="modal" style="display: block">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Map settings</h5>

          <button type="button" class="close" aria-label="Close" @click="$emit('close')">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="d-flex">

            <div class="flex-fill">
              <strong>Color scheme</strong>
              
              <div class="custom-control custom-radio">
                <input v-model="blendmode" value="normal" :checked="blendmode == 'normal'" type="radio" id="blendmode1" name="blendmode" class="custom-control-input">
                <label class="custom-control-label" for="blendmode1">Faded</label>
              </div>
              <div class="custom-control custom-radio">
                <input v-model="blendmode" value="lineardodge" :checked="blendmode == 'lineardodge'" type="radio" id="blendmode2" name="blendmode" class="custom-control-input">
                <label class="custom-control-label" for="blendmode2">Light</label>
              </div>
              <div class="custom-control custom-radio">
                <input v-model="blendmode" value="screen" :checked="blendmode == 'screen'" type="radio" id="blendmode3" name="blendmode" class="custom-control-input">
                <label class="custom-control-label" for="blendmode3">Screen</label>
              </div>
              <div class="custom-control custom-radio">
                <input v-model="blendmode" value="softlight" :checked="blendmode == 'softlight'" type="radio" id="blendmode4" name="blendmode" class="custom-control-input">
                <label class="custom-control-label" for="blendmode4">Softlight</label>
              </div>
              <div class="custom-control custom-radio">
                <input v-model="blendmode" value="hardlight" :checked="blendmode == 'hardlight'" type="radio" id="blendmode5" name="blendmode" class="custom-control-input">
                <label class="custom-control-label" for="blendmode5">Hardlight</label>
              </div>
              <div class="custom-control custom-radio">
                <input v-model="blendmode" value="inverted" :checked="blendmode == 'inverted'" type="radio" id="blendmode6" name="blendmode" class="custom-control-input">
                <label class="custom-control-label" for="blendmode6">Vivid</label>
              </div>
              <div class="custom-control custom-radio">
                <input v-model="blendmode" value="multiply" :checked="blendmode == 'multiply'" type="radio" id="blendmode7" name="blendmode" class="custom-control-input">
                <label class="custom-control-label" for="blendmode7">Dark</label>
              </div>
            </div>
          
            <div class="flex-fill">
              <strong>Game HUD</strong>

              <div class="custom-control custom-checkbox">
                <input v-model="smartcast" :checked="smartcast" type="checkbox" class="custom-control-input" id="smartCast1">
                <label class="custom-control-label" for="smartCast1">Enable smartcast</label>
              </div>

              <div class="custom-control custom-checkbox">
                <input v-model="show_flags" DISABLED :checked="show_flags" type="checkbox" class="custom-control-input" id="showflags1">
                <label class="custom-control-label" for="showflags1">Show country flags</label>
              </div>

              <div class="custom-control custom-checkbox">
                <input v-model="thick_borders" DISABLED :checked="thick_borders" type="checkbox" class="custom-control-input" id="thickBorders1">
                <label class="custom-control-label" for="thickBorders1">Stylish borders</label>
              </div>

              <div class="custom-control custom-checkbox">
                <input v-model="units3d" DISABLED :checked="units3d" type="checkbox" class="custom-control-input" id="units1">
                <label class="custom-control-label" for="units1">3D Army figures</label>
              </div>

            </div>

            <div class="flex-fill">
              <strong>Audio</strong>

              <div class="custom-control custom-checkbox">
                <input v-model="muteall" :checked="muteall" type="checkbox" class="custom-control-input" id="muteall">
                <label class="custom-control-label" for="muteall">Mute all</label>
              </div>

              <div class="custom-control custom-checkbox">
                <input v-model="sfx_music" :checked="sfx_music" type="checkbox" class="custom-control-input" id="sfx_music">
                <label class="custom-control-label" for="sfx_music">Music</label>
              </div>

              <div class="custom-control custom-checkbox">
                <input v-model="sfx_my" :checked="sfx_my" type="checkbox" class="custom-control-input" id="sfx_my">
                <label class="custom-control-label" for="sfx_my">Move, Buy</label>
              </div>

              <div class="custom-control custom-checkbox">
                <input v-model="sfx_turns" :checked="sfx_turns" type="checkbox" class="custom-control-input" id="sfx_turns">
                <label class="custom-control-label" for="sfx_turns">Turn</label>
              </div>

              <div class="custom-control custom-checkbox">
                <input v-model="sfx.chat_msg" :checked="sfx.chat_msg" type="checkbox" class="custom-control-input" id="sfx.chat_msg">
                <label class="custom-control-label" for="sfx.chat_msg">Chat</label>
              </div>

              <div class="custom-control custom-checkbox">
                <input v-model="sfx.tribute" :checked="sfx.tribute" type="checkbox" class="custom-control-input" id="sfx.tribute">
                <label class="custom-control-label" for="sfx.tribute">Tribute</label>
              </div>

              <div class="custom-control custom-checkbox">
                <input v-model="sfx.emperor" :checked="sfx.emperor" type="checkbox" class="custom-control-input" id="sfx.emperor">
                <label class="custom-control-label" for="sfx.emperor">Emperor</label>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;