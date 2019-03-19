
let to_load = 0;
let n_loaded = 0;
let _load = function() {
  console.error("No onload function is set.")
};

let loader_obj = {
  loaded: function() {
    n_loaded++;

    if (n_loaded >= to_load) {
      _load();
    }
  }
}

export function load(fun) {
  to_load++;

  fun.call(loader_obj);
};

export function onload(fun) {
  _load = fun;
};