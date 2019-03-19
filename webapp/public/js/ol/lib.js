

export function gps2merc(coord){
    return ol.proj.transform(coord,'EPSG:4326','EPSG:3857');
}

export function merc2gps(coord){
    return ol.proj.transform(coord,'EPSG:3857','EPSG:4326');
}

export function centroid(pts) {
   var first = pts[0], last = pts[pts.length-1];
   if (first[0] != last[0] || first[1] != last[1]) pts.push(first);
   var twicearea=0,
   x=0, y=0,
   nPts = pts.length,
   p1, p2, f;
   for ( var i=0, j=nPts-1 ; i<nPts ; j=i++ ) {
      p1 = pts[i]; p2 = pts[j];
      f = p1[0]*p2[1] - p2[0]*p1[1];
      twicearea += f;          
      x += ( p1[0] + p2[0] ) * f;
      y += ( p1[1] + p2[1] ) * f;
   }
   f = twicearea * 3;
   return [x/f, y/f];
}


export function polyCoords(geometry) {
  var poly = geometry.getCoordinates();

  // Check if polygon is multipoly
  if (geometry.getType() == 'Polygon')
      return poly;
  // polygon is single poly
  return poly[0];
}

export function ringCoords(geometry) {
  var poly = geometry.getCoordinates();

  // Check if polygon is multipoly
  if (geometry.getType() == 'Polygon')
      return poly[0];
  // polygon is single poly
  return poly[0][0];
}
