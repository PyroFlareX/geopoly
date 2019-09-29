import {countries} from '/engine/modules/worlds/world.js'
import {areaSource} from '/js/layers/areas.js';


//export function get_top_countries() {}

export function reset_game_entities(init) {
  /**
   * Resets all areas and countries
   * and recalculates their attributes
   **/
  console.info("reset game entities");

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

    if (feature.get('unit')) {
      countries[iso].pop -= 1;

      // Reset area exhaust (but not if this is an initial reset!)
      if (!init && feature.get('exhaust') > 0)
        feature.set('exhaust', feature.get('exhaust')-1);
    }

    if (feature.get('tile') == 'city') {

     // calculate conquers:
      if (iso2 != iso) {
        if (countries[iso])
          countries[iso].stats.conquers += 1;

        if (countries[iso2])
          countries[iso2].stats.losses += 1;
      }

      // and then reset iso2
      feature.set('iso2', feature.get('iso'));

      // recalculate set pop and income statistics
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
  }
}


export function apply_capture(iso, iso2) {
  const country = countries[iso];
  country.stats.conquers += 1;

  const country2 = countries[iso2];

  if (country2 && country2.shields > 0)
    country2.shields -= 1;

  country.shields += 1;
}

export function apply_kill(iso2) {
  if (countries[iso2])
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

export function apply_payday(taxes, emp) {
  // reset emperor title 
  for (let [iso,country] of Object.items(countries)) {
    country.emperor = false;
    country.gold += taxes[iso]||0;
  }

  // set emperor title & receive extra gold
  countries[emp].emperor = true;
  countries[emp].gold += 20;
}
