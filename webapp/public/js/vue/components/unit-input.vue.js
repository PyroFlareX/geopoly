
export const template = `
<div>
  <div>
    <select type="text" v-model="deck" class="form-control mb-2 mr-sm-2" id="name-input" placeholder="Deck">
      <option value="">New deck</option>

      <option :value="name" v-for="(deck,name) in decks">{{ name }}</option>
    </select>
  </div>
  <div class="row">
    <div class="col">

      <form class="form-inline">
        <input type="text" v-model="name" class="form-control mb-2 mr-sm-2" id="name-input" placeholder="Name of deck">


        <button @click="onSubmit" class="btn btn-danger mb-2">Save deck</button>
      </form>

    </div>
    <div class="col text-right">
      <p>
        Army strength: <strong :class="points > MAX_POINTS ? 'text-danger' : 'text-success'">{{ points }}</strong> / <span>{{ MAX_POINTS.estimation() }}</span>
      </p>
    </div>
  </div>
  <div class="row" :t="t">
    <div class="col">
      <p class="text-center"> <span class="ra ra-2x ra-class-infantry"></span> </p>

      <div v-for="u in UNITS_INF" :id="u" class="input-group mb-1">
        <div v-on:click="toggle(u)" class="input-group-prepend pointer">
          <span class="input-group-text" :id="u+'a'">
            <span :class="'ra ra-2x ra-unit-'+u"></span>
          </span>
        </div>
        <input type="number" v-model.number="patch[u]" @change="change" @click="change" @keypress="change" @focus="$event.target.select()" min="0" :class="'form-control input-2x ' + (points > MAX_POINTS?'is-invalid':'')" placeholder="<<unit name>>" aria-label="unit number" :aria-describedby="u+'a'">
      </div>

    </div>
    <div class="col">
      <p class="text-center"> <span class="ra ra-2x ra-class-cavalry"></span> </p>

      <div v-for="u in UNITS_CAV" :id="u" class="input-group mb-1">
        <div v-on:click="toggle(u)" class="input-group-prepend pointer">
          <span class="input-group-text" :id="u+'a'">
            <span :class="'ra ra-2x ra-unit-'+u"></span>
          </span>
        </div>
        <input type="number" v-model.number="patch[u]" @change="change" @click="change" @keypress="change" @focus="$event.target.select()" min="0" :class="'form-control input-2x ' + (points > MAX_POINTS?'is-invalid':'')" placeholder="<<unit name>>" aria-label="unit number" :aria-describedby="u+'a'">
      </div>

    </div>
    <div class="col">
      <p class="text-center"> <span class="ra ra-2x ra-class-artillery"></span> </p>

      <div v-for="u in UNITS_ART" :id="u" class="input-group mb-1">
        <div v-on:click="toggle(u)" class="input-group-prepend pointer">
          <span class="input-group-text" :id="u+'a'">
            <span :class="'ra ra-2x ra-unit-'+u"></span>
          </span>
        </div>
        <input type="number" v-model.number="patch[u]" @change="change" @click="change" @keypress="change" @focus="$event.target.select()" min="0" :class="'form-control input-2x ' + (points > MAX_POINTS?'is-invalid':'')" placeholder="<<unit name>>" aria-label="unit number" :aria-describedby="u+'a'">
      </div>

    </div>
  </div>

</div>
`;