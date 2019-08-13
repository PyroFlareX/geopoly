

export function init_chat(chat) {
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

  };

  chat.sub();
}