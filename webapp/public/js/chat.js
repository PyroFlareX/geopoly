
function burnchat(text) {
  // will be presented with burning text in the chat

  return function() {

  }
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
    'flup': 'flup.png',
    'baby jesus': 'baby_jesus.png',
    'beholder': 'beholder.png',
    'eme': 'eme_logo.png',
    'sadgry': 'sadgry.png',
    'katzen': 'katzen.png',
    'idgaf': 'idgaf.png',
    'thunk': 'thunk.png',
    'sync dab': 'sync_dab.gif',
    'lookin': 'eyes.gif',
    'ramsay': 'slap.gif',
    'wowzors': 'wowzors.png',
    'sorrihihi': 'sorry_hihi.png',
    'triggered': 'triggered.png',
    'trump': 'trump.gif',
    'snek': 'snek.png',
    'mummy': 'mummy.png',
    'miaow': 'miaow.png',
    'headbop': 'headbop.gif',
    'hipson': 'hopsin.png',
  };

  chat.actions = {
  // ----- COMMANDS -----:
    "geopoly": burnchat("geopoly"),
    "geogine": burnchat("geogine"),
    "doors": burnchat("doors"),
    "obo": burnchat("obo"),
    "ooh wah-ah-ah-ah": burnchat("ooh wah-ah-ah-ah"),
    "eme": burnchat("eme"),
    "wisteria lane": ()=>{
      // will turn the different unit types into their equivalents from the Desperate Housewives universe
    },
    "and now my order is in YOUR court": () =>{
      //plays judge eric andre music
    },
    "ilyesadam bazmeg": ()=>{
      // will be presented with burning text in the chat
      // makes the screen shake and surrenders

      return burnchat("ilyesadam bazmeg");
    },
    "surrender": ()=>{
      // kicks you out of the game
    },
    "draw": ()=>{
      // ends game in draw in offline mode
      // in online mode, a draw is offered to the other users

      // draws will not count as ranked matches and gained XP is halved
    },

  // ----- OFFLINE MODE CHEATS -----:
    "reset": ()=>{
      // resets the world
      // in online mode, a reset is offered to the other users

      fetch('dev/reset').then((resp)=>{
        return resp.json();
      }).then((resp)=>{
        window.location = '/';
      });
    },
    "obey appa": ()=>{
      // forces current user to quit its turn
      return burnchat("obey appa");
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
    "flame was a god": ()=>{
      // gives you infantry at all city tiles
    },
  };

  try {
    chat.config = conf;
    chat.sub();    
  } catch(e) {
    console.error("Chat module failed: ", e);
  }
}
