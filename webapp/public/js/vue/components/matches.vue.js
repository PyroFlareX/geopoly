export const template = `
<div>
  <table class="table table-striped table-hover table-condensed">

    <thead>
      <th>#</th>
      <th>Map</th>
      <th>Players</th>
      <th>Rounds</th>
    </thead>

    <tbody>
      <tr @click="join(match)" class="pointer" v-for="match in matches">
        <td><img :src="match_icon_src(match)" style="width: 20px; height: 20px;" /></td>        
        <td>{{ map_name(match.map) }}</td>
        <td>{{ match.isos.length }} / {{ match.max_players }}</td>
        <td>{{ match.rounds }} / {{ match.max_rounds }}</td>
      </tr>
    </tbody>
  </table>
</div>
`;