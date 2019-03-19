
export const UNITS = [
  'inf_light','inf_home','inf_gren','inf_skirmish',
  'cav_lancer','cav_hussar','cav_dragoon','cav_heavy',
  'art_light','art_heavy','art_mortar'
];

const UTYPE_DISPLAY_THRESH = 0.62;

export function getUnitComposition(area) {
  if (area instanceof ol.Feature) var area = area.getProperties();

  let mils = 0;
  let count_u = {}, count_c = defaultdict(int, true);
  let max_u = null;

  for (let u of UNITS) {
    let c = u.substr(0,3);
    let num = area[u] || 0;

    count_u[u] = num;
    count_c[c] += num;
    mils += num;

    // get most common unit
    if (num > (area[max_u]||0)) {
      max_u = u;
    }
  }

  if (mils == 0)
    return [mils, '', ''];

  // if the most common unit is in great numbers, display its logo
  if (count_u[max_u] / mils >= UTYPE_DISPLAY_THRESH)
    return [mils, max_u.substr(0,3), max_u];

  // otherwise we just display the class of unit
  let max_c = Object.keys(count_c).reduce((a, b) => count_c[a] > count_c[b] ? a : b);

  return [mils, max_c, ''];
}

export function getUnits(area) {
  if (area instanceof ol.Feature) var area = area.getProperties();
  
  let mils = 0;

  for (let u of UNITS) {
    let num = area[u] || 0;
    mils += num;
  }

  return mils;
}