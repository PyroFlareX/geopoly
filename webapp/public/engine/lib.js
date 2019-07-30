

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

export function multipolyCoords(geometry) {
  var poly = geometry.getCoordinates();

  // Check if polygon is polygon
  if (geometry.getType() == 'Polygon')
      return [poly];

  // polygon is single multipoly
  return poly;
}

export function polyCoords(geometry) {
  var poly = geometry.getCoordinates();

  // Check if polygon is polygon
  if (geometry.getType() == 'Polygon')
      return poly;

  // polygon is single multipoly
  return poly[0];
}

export function ringCoords(geometry) {
  var poly = geometry.getCoordinates();

  // Check if polygon is polygon
  if (geometry.getType() == 'Polygon')
      return poly[0];

  // polygon is single multipoly
  return poly[0][0];
}


export const vv = {

  norm: function(V) {
    var len = Math.sqrt(V[0]*V[0] + V[1]*V[1]);

    if (len == 0)
      return V;

    return [V[0]/len, V[1]/len];
  },

  cosangle: function(Pc,P2,P3) {
    var a = vv.dist(Pc, P2);
    var b = vv.dist(Pc, P3);
    var c = vv.dist(P2, P3);

    var angle1 = Math.acos((c*c - a*a - b*b) / (-2*a*b));
    //var angle2 = Math.acos((a*a + b*b - c*c) / (2 * a * b));

    return angle1;
  },

  dot: function(V0,V1) {
    return V0[0]*V1[0] + V0[1]*V1[1];
  },

  det: function(V0,V1) {
    return V0[0]*V1[0] - V0[1]*V1[1];
  },

  dist: function(P0,P1) {
    var V = [P1[0] - P0[0], P1[1] - P0[1]];
    return Math.sqrt(V[0]*V[0] + V[1]*V[1]);
  },

  len: function(V) {
    return Math.sqrt(V[0]*V[0] + V[1]*V[1]);
  },

  ector: function(P0,P1) {
    return [P0[0]-P1[0], P0[1]-P1[0]];
  },

  dir: function(P0,P1) {
    var V = [P1[0] - P0[0], P1[1] - P0[1]];
    return vv.norm(V);
  },

  perpR: function(V) {
    return [V[1], -V[0]];
  },
  perpL: function(V) {
    return [-V[1], V[0]];
  },

  bisector: function(V0, V1) {
    return [V0[0]+V1[0], V0[1]+V1[1]];
  },

  angle: function(V0,V1){
    return Math.acos( (vdot(V0,V1)) / (vv.len(V0)*vv.len(V1)) );
  },


};