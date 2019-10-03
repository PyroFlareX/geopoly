import {add_border_layer} from '/engine/modules/borders/borders.js';
import {countries} from '/engine/modules/worlds/world.js';



export const countryLayer = add_border_layer('border-stroke', {
 width: 4,
 fill: 'color-blend',
});

countryLayer.click = (feature, key, event) => {
  
  if (!feature) {
    // hide GUI overlays
    gui.overlay('close');
  } else if (!key) {
    let iso = feature.get('iso');

    gui.overlay('country', event.coordinate, countries[iso]);
  } else {
    // DEBUG country feature
    if (key == 'CTRL') {
      test_action(feature);
    }
  }
}

countryLayer.keydown = (feature, key) => {
  if (key == 'ESCAPE') {
    // exit GUI overlays
    gui.overlay('close');
  }
};
