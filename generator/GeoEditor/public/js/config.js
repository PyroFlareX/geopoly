
// area values
export const FIELD_ID = 'id';
export const FIELD_OWNER = 'iso';
export const FIELD_NAME = 'name';


export const MAP_CENTER = ol.proj.transform([10, 45],'EPSG:4326','EPSG:3857');
export const MAP_ZOOM = 4;

export const SHOW_LABELS = false;

export const GEOFILE = 'areas.geojson';

export function getColor(iso) {
  if (!iso)
    return 'rgba(50,270,50,0.04)';

  let srng = new SRNG(iso.charCodeAt(0) + iso.charCodeAt(1));

  return `rgba(${round(srng.random()*160+50)},${round(srng.random()*160+50)},${round(srng.random()*160+50)}, 0.7)`;
  
    //   else if (isocolors[iso]) {
    //   var col = isocolors[iso].a(0.6).rgba();
    // } else 
    //   var col =

}

const isocolors = {
  'UK': new Color([207, 20, 43]),
  'FR': new Color([3, 7, 147]),
  'RU': new Color([63, 120, 35]),
  'IT': new Color([30, 190, 75]),
  'SE': new Color([0, 40, 104]),
  'DK': new Color([230, 29, 24]),
  'AT': new Color([254, 205, 33]),
  'DE': new Color([60, 77, 75]),
  'ES': new Color([170, 110, 40]),
  'NL': new Color([253, 73, 29]),
  'BE': new Color([128, 78, 56]),
  'CH': new Color([232, 43, 54]),
  'PT': new Color([0, 81, 151]),
  'EL': new Color([116, 172, 223]),
  'RO': new Color([145, 30, 180]),
  'RS': new Color([128, 106, 43]),
  'BG': new Color([0, 161, 242]),
  'TR': new Color([194, 24, 40]),

  // 'EG': new Color([158, 11, 33]),
  // 'MA': new Color([243, 67, 38]),
  // 'IR': new Color([245, 130, 48]),
};