
/**
 * Dev test functions
 **/
function init_test() {
  //countries['UK'].pop = 99;
  console.info("Test module loaded!");
  //for (let i of range(0,19))
  //  layers.item(1).getSource().getFeatures()[i].set('iso','UK');

  //gui.infobar('country', countries.UK);
}

function test_action(feature) {
  // triggered by a CTRL key

  // de-exhaust
  if (feature.get('exhaust') > 0)
    feature.set('exhaust', 0);

  // DEBUG area feature
  console.log(feature.getId(), feature.get('iso'), feature.getProperties());
}
