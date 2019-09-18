import {ws_client} from '/engine/modules/websocket/wsclient.js';
import {chat_gui} from '/engine/modules/chat/gui.js';
import {world} from '/engine/modules/worlds/world.js'


export function add_sys_message(msg, iso) {
  gui.flash(msg, "white", iso);


  // add timestamp for chat
  msg += `  [T${world.rounds}]`;

  chat_gui.add_message({
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
    'angry': '(.gif',
    'animeskull': 'animeskull.png',
    'obo': 'beholder.png',
    'boolean': 'boolean.png',
    'happy': 'D.gif',
    'eme': 'eme_logo.png',
    'eyes': 'eyes.gif',
    'favicon': 'favicon.png',
    'flup': 'flup.png',
    'geoguy': 'geoguy.png',
    'geolite': 'geolite.png',
    'headbop': 'headbop.gif',
    'hopsin': 'hopsin.png',
    'idgaf': 'idgaf.png',
    'katzen': 'katzen.png',
    'geo': 'logo.png',
    'meh': 'meh.png',
    'melon': 'melon.png',
    'metroplier': 'metroplier.png',
    'moth': 'moth.png',
    'mummy': 'mummy.png',
    'parker': 'parker.gif',
    'rekt': 'rekt.png',
    'sadgry': 'sadgry.png',
    'slap': 'slap.gif',
    'smh': 'smh.gif',
    'snek': 'snek.png',
    'dany': 'sorry_hihi.png',
    'syncdab': 'sync_dab.gif',
    'thunk': 'thunk.png',
    'tribute': 'tribute.png',
    'triggered': 'triggered.png',
    'trump': 'trump.gif',
    'trumpo': 'trumpo.png',
    'walrus': 'whead.png',
    'walrus2': 'O.png',
    'whoa mama': 'whoa_mama.png',
    'wowzors': 'wowzors.png',
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
