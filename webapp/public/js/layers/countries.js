import {init_borders, add_border_layer} from '/engine/modules/borders/borders.js';
import {countries} from '/engine/modules/worlds/world.js';


export const countryLayer = add_border_layer('border-stroke', {
 width: 4,
 fill: 'color-blend',
 minResolution: 2445
});


countryLayer.click = (feature, key, event) => {
  let iso = feature.get('iso');


  gui.overlay('country', event.coordinate, countries[iso]);

  console.log(iso);
}

  // layers['border-stroke'].click = on_click;
  // layers['border-fill'].click = on_click;
  // layers['border-instroke'].click = on_click;

export function init_countries(conf) {
  init_borders(conf);
}