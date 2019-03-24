import {map, view} from '/js/ol/map.js';

import {setArea, generateBorders} from '/js/ol/gfx.js';
import {centroid, gps2merc, ringCoords} from '/js/ol/lib.js';
import {rules, match as sMatch, set_turn, countries} from '/js/game/store.js';
import {areaSource} from '/js/ol/layers/areas.js';

import {load, onload} from '/js/game/loader.js';
import {client} from '/js/game/client.js';


view.setCenter([1606523.03, 6222585.53]);
view.setZoom(6);

// more debug variables
window.layers = map.getLayers();
window.areas = window.layers.item(1).getSource();

function special_tests() {

  // TEST:
  //gui.infobar('move', source.getFeatureById(2), source.getFeatureById(1));

  //gui.infobar('events');
}

export function load_test(ws_address) {
  // debug: set global variables
  window.rules = rules;
  window.match = sMatch;
  window.map = map;
  window.client = client;

  if (!client.is_offline_test) {
    // Load game otherwise

    load(function() {
      client.connect(ws_address, () => {

        client.request("Dev:setup", {}).then(() => {

          client.request("Matches:load", {}).then(({err, me, match, players}) => {
            if (err) {
              console.error("No match for you", err);
              return;
            }

            client.request("Areas:load", {}).then(({areas}) => {
              this.ctx.areas = areas;

              this.loaded();
            });

            sMatch.me = me;
            sMatch.map = match.map;
            sMatch.max_players = match.max_players;
            sMatch.max_rounds = match.max_rounds;
            sMatch.mid = match.mid;
            sMatch.events = match.events;

            set_turn(match);

            // add usernames of players too
            for (let user of players) {
              let player = countries[user.iso].player;

              player.name = user.username || (player.name + " (*)");
              player.default = false;
              player.uid = user.uid;
            }

          });

        });

      });

    });
  }
}

export function init_test() {

  if (client.is_offline_test) {
    for (let area of areas) {
      setArea(area);
    }

    turn.me = 'AT';
    turn.current = 'AT';
    turn.players = ['AT', 'RU', 'FR', 'UK'];
  }

  for (let feature of areaSource.getFeatures()) {
    if (client.is_offline_test) {
      // create country if doesn't exist
      let countryFeature = countrySource.getFeatureById(area.iso);
      if (!countryFeature)
        countryFeature = createCountryFeature(area.iso);      
    }

    // set centroid
    if (!feature.get('cen')) {
      let geom = feature.getGeometry();

      feature.set('cen', centroid(ringCoords(geom)));
    }

    // safe check: fix wgs84 to mercator
    let cen = feature.get('cen');
    if (cen[0] <= 180 && cen[1] <= 180)
      feature.set('cen', gps2merc(cen));

    // add id to properties
    feature.set('id', feature.getId());
  }

  //generateBorders();

  special_tests();
}

// set up some match
let areas = [
  {
    id: 'AT312',
    iso: 'AT',

    inf_light: 100,
    inf_home: 7,
    inf_gren: 0,
    inf_skirmish: 0,
    cav_lancer: 0,
    cav_hussar: 0,
    cav_dragoon: 0,
    cav_heavy: 0,
    art_light: 0,
    art_heavy: 0,
    art_mortar: 0,
  },
  {
    id: 'AT323',
    iso: 'AT',

    inf_light: 0,
    inf_home: 250,
    inf_gren: 5,
    inf_skirmish: 0,
    cav_lancer: 0,
    cav_hussar: 20,
    cav_dragoon: 0,
    cav_heavy: 0,
    art_light: 0,
    art_heavy: 12,
    art_mortar: 0,
  },
  {
    id: 'DE22',
    iso: 'DE',

    inf_light: 0,
    inf_home: 0,
    inf_gren: 0,
    inf_skirmish: 0,
    cav_lancer: 0,
    cav_hussar: 0,
    cav_dragoon: 0,
    cav_heavy: 20,
    art_light: 0,
    art_heavy: 0,
    art_mortar: 0,
  },
  {
    id: 'FRF3',
    iso: 'FR',

    inf_light: 0,
    inf_home: 0,
    inf_gren: 0,
    inf_skirmish: 0,
    cav_lancer: 0,
    cav_hussar: 0,
    cav_dragoon: 10,
    cav_heavy: 0,
    art_light: 0,
    art_heavy: 0,
    art_mortar: 0,
  }
];
