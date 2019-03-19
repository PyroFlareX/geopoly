
export function getColor(area) {
  if (area instanceof ol.Feature) var area = area.getProperties();
  let iso = area.iso;

  return new Color(0, 70, 255);
}