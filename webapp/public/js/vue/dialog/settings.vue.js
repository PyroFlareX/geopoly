
export const template = `
<div v-if="show">
  <div class="modal" style="display: block">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Map settings</h5>

          <button type="button" class="close" aria-label="Close" v-on:click="show=false">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row">


            <div class="col-4">
              <strong>Background</strong>

              <div class="custom-control custom-radio">
                <input v-model="baseLayer" value="outline" :checked="baseLayer == 'outline'" type="radio" id="baseLayerRadio3" name="baseLayerRadio" class="custom-control-input">
                <label class="custom-control-label" for="baseLayerRadio3">Blank map</label>
              </div>

              <div class="custom-control custom-radio">
                <input v-model="baseLayer" value="watercolor" :checked="baseLayer == 'watercolor'" type="radio" id="baseLayerRadio1" name="baseLayerRadio" class="custom-control-input">
                <label class="custom-control-label" for="baseLayerRadio1">Watercolor</label>
              </div>
            </div>


            <div class="col-4">
              <strong>Color scheme</strong>
              
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
                <input v-model="blendmode" value="normal" :checked="blendmode == 'normal'" type="radio" id="blendmode1" name="blendmode" class="custom-control-input">
                <label class="custom-control-label" for="blendmode1">Faded</label>
              </div>
              <div class="custom-control custom-radio">
                <input v-model="blendmode" value="hardlight" :checked="blendmode == 'hardlight'" type="radio" id="blendmode5" name="blendmode" class="custom-control-input">
                <label class="custom-control-label" for="blendmode5">Hardlight</label>
              </div>
              <div class="custom-control custom-radio">
                <input v-model="blendmode" value="multiply" :checked="blendmode == 'multiply'" type="radio" id="blendmode6" name="blendmode" class="custom-control-input">
                <label class="custom-control-label" for="blendmode6">Vivid</label>
              </div>
            </div>


            <div class="col-6">
              <strong>Other settings</strong>

              <div class="custom-control custom-checkbox">
                <input v-model="smartcast" value="hide" :checked="smartcast" type="checkbox" class="custom-control-input" id="smartCast1">
                <label class="custom-control-label" for="smartCast1">Enable smartcast</label>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;