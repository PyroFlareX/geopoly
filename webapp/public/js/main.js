import {gui} from '/js/vue/gui.js';

import {map, view} from '/js/ol/map.js';
import {init_game} from '/js/ol/gfx.js';

import {load, onload} from '/js/game/loader.js';
import {client} from '/js/game/client.js';
import {rules, match as sMatch, decks, set_turn, countries} from '/js/game/store.js';

import {AreasGroup} from '/js/game/groups/areas.js';
import {GameGroup} from '/js/game/groups/game.js';
import {MatchesGroup} from '/js/game/groups/matches.js';

import {init_test} from '/js/test.js';


export function init_app(debug, ws_address, uid, token) {
  view.setCenter([1405000, 6404000]);
  view.setZoom(5);

  window.gui = gui;

  client.groups.Areas = new AreasGroup(client);
  client.groups.Game = new GameGroup(client);
  client.groups.Matches = new MatchesGroup(client);

  onload((ctx) => {
    console.info("Matches loaded");

    init_test(ctx);
    init_game(ctx);
  });
  
  if (debug) {
    window.rules = rules;
    window.match = sMatch;
    window.map = map;
    window.client = client;
    
    window.layers = map.getLayers();
    window.areas = window.layers.item(1).getSource();
  }

  load(function() {
    client.connect(ws_address, () => {
      client.request("Users:guest", {uid: uid}).then(({user}) => {
        let _mid = user.mid || Params.get('mid', null);

        if (debug) {
          load(function() {
            client.request("Dev:setup", {}).then(({me}) => {
              this.loaded();
            });
          })
        }

        client.request("Game:load", {mid: _mid}).then(({err, me, match, players}) => {
          if (err) {
            console.error("No match for you", err);
            alert("Match was not found. Probably it ended. Reason:", err);
            window.location = '/';
            return;
          }

          client.request("Areas:load", {mid: _mid}).then(({areas}) => {
            this.ctx.areas = areas;

            this.loaded();
          });

          // set match attributes
          sMatch.map = match.map;
          sMatch.max_players = match.max_players;
          sMatch.max_rounds = match.max_rounds;
          sMatch.mid = match.mid;
          sMatch.events = match.events;

          if (me) {
            // We area already joined

            sMatch.me = me;
          } else if (Params.get("mid")) {
            // We wish to join, but haven't yet

            //gui.$refs.recommend.show = true;
            sMatch.can_join = len(sMatch.isos) < sMatch.max_players && sMatch.rounds < 0.25*sMatch.max_rounds;

            // load decks, because the claimer will need them

            client.request("Decks:load", {}).then((resp) => {
              for (let d of resp.decks)
                decks.push(d);

              //this.loaded();
            });
          }

          set_turn(match);

          for (let [iso, country] of Object.items(countries)) {
            let player = players[iso];

            if (player) {
              // add player
              player.name = user.username || (player.name + " (*)");
              player.default = false;

              country.player = player;
              //player.uid = player.uid;
            } else {

            }
          }

        });
      });
    });
  });
}
