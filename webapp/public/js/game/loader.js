
let to_load = 0;
let n_loaded = 0;
let _preload = [], _postload = [], _load = function() {
  console.error("Please set onload function")
};

let loader_obj = {
  loaded: function() {
    n_loaded++;

    if (n_loaded >= to_load) {
      // pre onload
      for (let l of _preload)
        l();

      // main onload
      _load();

      // post onload
      for (let l of _postload)
        l();
    }
  },

  before_loadend: function(fun) {
    _preload.push(fun);
  },

  after_loadend: function(fun) {
    _postload.push(fun);
  }
}

export function load(fun) {
  to_load++;

  fun.call(loader_obj);
};

export function onload(fun) {
  _load = fun ;
};