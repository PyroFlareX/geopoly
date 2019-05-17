import {component as MatchInput} from "/js/vue/components/match-input.js";
import {component as CountryPickerDialog} from "/js/vue/dialog/country-picker.js";
import {component as CharacterDialog} from "/js/vue/dialog/character.js";

export const template = `
  <div class="container">
    <match-input ref="match"></match-input>


    <dialog-country-picker v-on:picked="$refs.match.setCountry($event)" ref="dialog-country-picker"></dialog-country-picker>
    <dialog-character v-on:picked="$refs.match.setCharacter($event)" ref="dialog-character"></dialog-character>
  </div>
`;