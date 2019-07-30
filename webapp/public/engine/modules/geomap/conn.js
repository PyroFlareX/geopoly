
export const conn = defaultdict(list, true);
fetch('/json/conn.json', {cache: 'force-cache'}).then((resp) => {
  return resp.json();
}).then((resp) => {
  for (let [iso1, iso2] of resp) {
    conn[iso1].push(iso2);
    conn[iso2].push(iso1);
  }
});