import {component as matchesComp} from "/js/vue/components/matches.js";
import {component as createDialog} from "/js/vue/dialog/create-match.js";
import {component as hallDialog} from "/js/vue/dialog/hall-match.js";
import {component as joinDialog} from "/js/vue/dialog/join-match.js";

export const template = `
  <div class="container">

    <div class="row">

      <matches class="col-8" ref="matches"></matches>


      <div class="col-4">
        <button class="btn btn-danger" @click="dialog('create-match')">New match</button>
      </div>

    </div>

    <dialog-create-match ref="dialog-create-match"></dialog-create-match>
    <dialog-hall-match ref="dialog-hall-match"></dialog-hall-match>
    <dialog-join-match ref="dialog-join-match"></dialog-join-match>
  </div>
`;