import {ws_client} from '/engine/modules/websocket/wsclient.js';
import {world} from '/engine/modules/worlds/world.js'


export function add_sys_message(msg, iso) {
  gui.flash(msg, "white", iso);


  // add timestamp for chat
  msg = `[#${world.rounds}] <span class="small">${msg}</span>`;

  // hack
  gui.$refs['global-chat'].add_message({
    msg: msg,
    iso: iso,
    username: undefined
  });
}


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
    'geogine': 'whead.png',
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

    // discord themed
    'smh': 'smh.gif',
    'hopsin': 'hopsin.png',
    'boolean': 'boolean.png',
    'obo': 'beholder.png',

    // themed
    'catlooks': 'katzen.png',
    'moth': 'moth.png',
    'whoa mama': 'whoa_mama.png',
    'wowzors': 'wowzors.png',
    'pappa': 'pappa.gif',
  };

  chat.actions = {
    // ----- COMMANDS -----:
    "surrender": ()=>{
      // kicks you out of the game
      ws_client.request("Game:surrender", {}).then(()=>{
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
      fetch("dev/force_turn", {})
      .then((resp)=>{ return resp.json() })
      .then(ws_client.onmessage.bind(ws_client));
    },
    "reset": ()=>{
      // resets the world
      // in online mode, a reset is offered to the other users

      fetch('dev/reset')
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
  } catch(e) {
    console.error("Chat module failed: ", e);
  }
}
