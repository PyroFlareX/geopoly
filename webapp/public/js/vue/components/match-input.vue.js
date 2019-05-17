
export const template = `
<div>
  <p>You are about to join a world as a lord from a selected country of yours. Pick a country, customize your lord and let's go!</p>


  <div class="row">
    <div class="col">

      <div class="text-center card">
        <div class="card-body">
          <p class="card-text small">Your character:</p>

          <img @click="editProfile" :src="img_src" class="character-profile pointer" alt="Edit profile">

          <p class="card-text"><strong>{{ name }}</strong></p>
        </div>
      </div>

    </div>

    <div class="col">

      <div class="text-center card">
        <div class="card-body">
          <p class="card-text small">Selected country:</p>

          <div v-if="iso" @click="editCountry" class="pointer shield shield-inline shield-md shield-box" :style="herald(iso)"></div>

          <p class="card-text"><strong>{{ country_name }}</strong></p>
        </div>
      </div>

    </div>
  </div>

  <button @click="onSubmit" class="btn btn-lg btn-block btn-danger">Find world</button>

</div>
`;