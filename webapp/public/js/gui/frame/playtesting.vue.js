
export const template = `
<div>
  <div class="container">
    <br/>

    <div class="row">
      <div class="col">
        <h2 class="geopoly geopoly-sm">PlaYteStiNg</h2>

        <hr/>

        <button @click="onStart" class="btn btn-primary">Start Game</button>
        <button @click="onDelete" class="btn btn-danger">Reset match</button>
      </div>
      <div class="col">
        <h2 class="geopoly geopoly-sm">UserS:</h2>

        <div class="list-group">
          <div @click="onToggle(user)" :class="{'list-group-item pointer':true, 'active': users_incl.includes(user.uid)}" v-for="user in users">
            {{ user.username }} <span class="small">{{ user.uid }}</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>
`;