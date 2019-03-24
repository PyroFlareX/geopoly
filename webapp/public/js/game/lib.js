
export const UNITS = [
  'inf_light','inf_home','inf_heavy','inf_skirmish',
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

export function enumname(enum0, enumval) {
    for (var t in enum0)
        if (enum0[t] == enumval)
            return t;
};

const season_months = [
  ['12', '02'],
  ['03', '05'],
  ['06', '08'],
  ['09', '11']
];

export function getGameYear(rounds) {
  const start_year = 1853;
  let dy = Math.floor(rounds / 4);

  return start_year + dy;
}

export function getGameDate(rounds, N) {
  // get season & number of players:
  let s = rounds % 4;
  let num_players = N;

  // get the year, when the season ends and begins in
  let year_beg = getGameYear(rounds);
  let year_end = s == 0 ? year_beg+1 : year_beg;

  // get first and last month of season
  let [month_beg, month_end] = season_months[s];

  // date range for whole season:
  let t_beg = new Date(year_beg+"-"+month_beg+"-01T01:00:00");
  let t_end = new Date(year_end+"-"+month_end+"-28T23:00:00");

  if (num_players == 0) {
    // return first date
    var now = t_beg;
  } else {
    // this many in-game seconds per player turn:
    let dt_per_turn = ((t_end.getTime() - t_beg.getTime()) / 1000) / num_players;

    let pos = match.isos.indexOf(match.current);
    
    // return a random offset, using player's position in the queue
    let dt = (Math.random() * dt_per_turn) + dt_per_turn*pos;

    var now = t_beg;
    now.setSeconds(now.getSeconds() + dt);
  }

  let mm = now.toLocaleString("en-US", { month: "short" });
  let dd = now.getDate();

  return {month: mm, day: dd};
}
