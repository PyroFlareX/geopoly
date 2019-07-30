import {conn} from '/js/game/store.js';


export function find_path(source, target) {
  if (conn[source].includes(target))
    return [source, target];

  // Dijkstra algorithm
  let dist = defaultdict(()=>{return Infinity}, true);
  let previous = {};
  
  dist[source] = 0;
  let Q = new Set(Object.keys(conn));

  while(len(Q) > 0) {
    // u = node in Q with smallest dist[]
    let u = Object.keys(dist).reduce((min_key, key) => {
      return (Q.has(key) && (min_key == null || dist[key] < dist[min_key])) ? key : min_key;
    }, null);

    // this happens when we have a non-connected graph
    if (u == null)
      break;
    Q.delete(u);

    for (let v of conn[u]) {
      // where v has not yet been removed from Q.
      if (!Q.has(v))
        continue;
  
      let alt = dist[u] + 1;

      if (alt < dist[v]) {
        // Relax (u,v)
        dist[v] = alt;
        previous[v] = u;
      }
    }
  }


  let curr = target;
  let path = [];

  while (curr != source) {
    path.splice(0,0,curr);
    curr = previous[curr];
  }

  return path;
}