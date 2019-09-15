import {countries} from '/engine/modules/worlds/world.js'
import {areaSource} from '/js/layers/areas.js';


//export function get_top_countries() {}

export function calculate_economy() {
  for (let [iso, country] of Object.items(countries)) {
    // reset:
    country.pop = 0;

    country.stats = {
      conquers: 0,
      losses: 0,
      income: 0,
    };
  }


  for (let feature of areaSource.getFeatures()) {
    const iso = feature.get('iso');
    const iso2 = feature.get('iso2');

    if (!iso || !countries[iso])
      continue

    // calculate conquers:
    if (iso2 != iso) {
      countries[iso].stats.conquers += 1;
      countries[iso2].stats.losses += 1;
    }

    // calculate pops & payday:
    if (feature.get('tile') == 'city') {
      if (feature.get('build') == 'house') {
        countries[iso].pop += 1;
        countries[iso].stats.income += 10;
      } else if (feature.get('build') == 'barr') {
        countries[iso].pop += 3;
        countries[iso].stats.income += 10;
      } else if (feature.get('build') == 'cita') {
        countries[iso].pop += 1;
        countries[iso].stats.income += 30;
      }
    }

    if (feature.get('unit'))
      countries[iso].pop -= 1;
  }
}

export function reassign_orders(start) {
  // TODO: ITT
  console.log("TODO: country reassign_orders");

  for (let [iso, country] of Object.items(countries)) {
    // pass
  }
}

export function apply_capture(iso, iso2) {
  const country = countries[iso];
  country.stats.conquers += 1;

  const country2 = countries[iso2];

  if (country2.shields > 0)
    country2.shields -= 1;
  country.shields += 1;
}

export function apply_kill(iso2) {
  countries[iso2].pop += 1;
}

export function apply_resources(iso, {gold, pop}, dir) {
  if (dir == null)
    dir = 1;

  if (gold)
    countries[iso].gold += dir*gold;
  if (pop)
    countries[iso].pop += dir*pop;
}

// export function set_payday(payday, _emperor) {
//   for (let [iso,country] of Object.items(countries)) {
//     country.emperor = false;

//     country.gold = payday[iso];
//   }

//   countries[_emperor].emperor = true;
//   countries[_emperor].gold += 20;
// }
