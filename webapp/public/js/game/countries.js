import {countries} from '/engine/modules/worlds/world.js'
import {areaSource} from '/js/layers/areas.js';


//export function get_top_countries() {}

export function calculate_economy() {

  for (let feature of areaSource.getFeatures()) {
    const iso = feature.get('iso');

    if (iso && countries[iso]) {
      if (feature.get('build') == 'barr')
        countries[iso].pop += 3
      else if (feature.get('tile') == 'city')
        countries[iso].pop += 1

      if (feature.get('unit'))
        countries[iso].pop -= 1
    }
  }
}

export function apply_capture(iso, iso2) {
  const country = countries[iso];
  country.conquers += 1;

  const country2 = countries[iso2];

  if (country2.shields > 0)
    country2.shields -= 1;
}

export function apply_kill(iso2) {
  countries[iso2].pop += 1;
}

// export function set_payday(payday, _emperor) {
//   for (let [iso,country] of Object.items(countries)) {
//     country.emperor = false;

//     country.gold = payday[iso];
//   }

//   countries[_emperor].emperor = true;
//   countries[_emperor].gold += 20;
// }
