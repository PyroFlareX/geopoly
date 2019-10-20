import {client} from '/client/websocket.js';
import {world} from '/engine/modules/worlds/world.js'
import {load, onload, toload} from '/engine/loader.js';


export function add_sys_message(event_id, iso, ...params) {
  let msg = messages[event_id];

  if (params)
    msg = msg.format(...params);

  gui.flash(msg, "white", iso);


  // add timestamp for chat
  msg = `[#${world.rounds}] <span class="small">${msg}</span>`;

  // play sound
  play_sfx(event_id);

  // hack
  gui.$refs['global-chat'].add_message({
    msg: msg,
    iso: iso,
    username: undefined
  });
}

export function play_sfx(sfx_id) {
  if (sounds[sfx_id].getVolume() > 5)
    sounds[sfx_id].play();
}

export function set_vol(sfx_id, vol) {
  if (sounds[sfx_id].getVolume() != vol)
    sounds[sfx_id].setVolume(vol);
}


const formats = {
  emperor: 'mp3', victory: 'mp3'
};

const sounds = {
  // local only sounds (only I hear it!)
  music: null,

  my_buy: null,
  my_move: null,
  my_turn: null,

  // global LOW
  new_turn: null,
  chat_msg: null,

  // global MEDIUM
  tribute: null,
  //sacrifice: null,
  emperor: null,

  // global HIGH
  surrender: null,
  victory: null,
};

//load("sounds", function () {
  for (let sfx of Object.keys(sounds)) {
    let sound = new buzz.sound(`/sounds/${sfx}`, {formats: [formats[sfx]||"wav"]});

    sounds[sfx] = sound;
  }

  // finished loading sounds -- well, we actually didn't
//   this.loaded();
// });



// All in-game event message templates:
const messages = {
  // General
  invalid_params: "invalid_params",
  bad_conf: "Unexpected item.",

  // Turn related
  not_your_turn: "It's not your turn.",
  not_mine: "It's not your area.",

  emperor: "New emperor: {}.",

  new_turn: "Current turn: {}.",
  my_turn: "It's your turn!",

  // Move
  cant_move_more: "You have already moved with this figure.",
  not_enemy: "Figure is not an enemy.",
  cant_attack_cavalry: "Cavalry can't attack forest.",
  cant_attack_there: "Can't attack there.",
  cant_move_there: "Can't move there.",

  // Buy
  buy: "{} has bought {} on {}!",
  cant_buy_after_move: "You can't buy new items after you have moved in your turn.",
  item_exists: "Item already exists on that area.",
  not_enough_gold: "You don't have enough money.",
  not_enough_pop: "You don't have enough population. Buy more buildings.",
  missing_city: "You can only build over a city.",
  missing_river: "You can only build a bridge over rivers.",
  missing_: "Rawr XD",

  // Other
  surrender: "{} has surrendered!",
  tribute: "{} has given {} gold to {}.",
  sacrifice: "{} has sacrificed a shield for a {} on {}!",
};

export function init_chat(chat, conf) {
  /**
   * Here you can add your custom commands and emojis
   * to use an emoji: 
   *   :happy:
   *
   * to use an action (command)
   *   /surrender and ENTER
   **/
  chat.emojis = {
    // meta / doors 
    'geogine': 'geogine.png',
    'geopoly': 'favicon.png',
    'geoguy': 'geoguy.png',
    'geolite': 'geolite.png',
    'geo': 'logo.png',
    'meh': 'meh.png',
    'idgaf': 'idgaf.png',
    'flup': 'flup.png',
    'eme': 'eme_logo.png',

    // game
    'tribute': 'tribute.png',
    'sacrifice': 'sacrifice.png',

    // generic
    'headbop': 'headbop.gif',
    'thunk': 'thunk.png',
    'angry': '(.gif',
    'happy': 'D.gif',
    'melon': 'melon.png',
    'sadgry': 'sadgry.png',

    // non PC / copyrighted
    'triggered': 'triggered.png',
    'trump': 'trump.gif',
    'trumpo': 'trumpo.png',
    'ajcry': 'ajsad.gif',
    'aj': 'alexjones.png',
    'snek': 'snek.png',
    'mummy': 'mummy.png',
    'metroplier': 'metroplier.png',
    'dany': 'sorry_hihi.png',
    'quigon': 'quigon.png',

    // discord themed
    'smh': 'smh.gif',
    'hopsin': 'hopsin.png',
    'boolean': 'boolean.png',
    'obo': 'beholder.png',

    // themed
    'catlooks': 'katzen.png',
    'rawr': 'raptor.gif',
    'moth': 'moth.png',
    'whoa mama': 'whoa_mama.png',
    'wowzors': 'wowzors.png',
    'pappa': 'pappa.gif',
  };

  chat.actions = {
    // ----- COMMANDS -----:
    "surrender": ()=>{
      // kicks you out of the game
      client.ws.request("Game:surrender", {}).then(()=>{
        gui.dialog('game-end', null);
      });
    },
    "draw": ()=>{
      // ends game in draw in offline mode
      // in online mode, a draw is offered to the other users

      // draws will not count as ranked matches and gained XP is halved
    },

    // ----- OFFLINE MODE CHEATS -----:
    "okcs": ()=>{
      // forces current player to end turn
      fetch("/admin/force_turn", {})
      .then((resp)=>{ return resp.json() })
      .then(client.ws.onmessage.bind(client.ws));
    },
    "reset": ()=>{
      // resets the world
      // in online mode, a reset is offered to the other users

      fetch('/admin/reset')
      .then((resp)=>{ return resp.json() })
      .then((resp)=>{
        window.location = '/';
      });
    },
    "killallboomers": ()=>{
      // kills infantry, cavalry, artillery of all other players
    },
    "i wanna be tracer": ()=>{
      // gives you cavalry at all city tiles
    },
    "kids with guns": ()=>{
      // gives you artillery at all city tiles
    },
    "ilyesadam bazmeg": ()=>{
      // gives you infantry at all city tiles
    },
    "and now my order is in YOUR court": () =>{
      // idk
    },
  };

  try {
    chat.config = conf;
    chat.sub();

    chat.onmessage = () => {
      play_sfx("chat_msg");
    };

  } catch(e) {
    console.error("Chat module failed: ", e);
  }
}
