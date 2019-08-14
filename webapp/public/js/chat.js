

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
  };

  chat.actions = {
    // every player's nickname turns into your mum gay, exept for the player
    "obey appa": ()=>{},
    // will turn the different unit types into their equivalents from the Desperate Housewives universe
    "wisteria lane": ()=>{},
    // will turn the different unit types into their equivalents from Baltimore
    "omar comin": ()=>{},
    // ??
    "keyborp": ()=>{},
    // will be presented with burning text in the chat
    //"geopoly/juhi/obo/tajter/szabesz/eme/bme/geogine/": ()=>{},
    // makes the screen shake and surrenders
    "ilyesadam bazmeg": ()=>{},
    // kicks you out of the game
    "surrender": ()=>{},

    // OFFLINE MODE CHEATS:
    //remove 50 percent units of any selected country
    "killallboomers": ()=>{},
    //gives you double infantry
    "flame": ()=>{},
    //gives you 250 money
    "cody ko": ()=>{},
  };

  chat.config = conf;
  chat.sub();
}