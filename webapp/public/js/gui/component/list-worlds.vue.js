export const template = `
<div v-if="show">
  <button class="btn btn-danger" @click="$emit('create')">New Match</button>
  <br/>

  <table class="table table-hover">
    <thead>
      
    </thead>
    <tbody>
      <tr v-for="world in worlds" class="pointer" @click="$emit('join', world)">
        <td>
          {{ world.players.length }} / {{ maps[world.map].max_players || world.max_players }}
        </td>
        <td>
          {{ maps[world.map].name }}
        </td>
        <td>
          {{ maps[world.map].year }}
        </td>
        <td>
          {{ world.name }}
        </td>
      </tr>
    </tbody>
  </table>
</div>
`;