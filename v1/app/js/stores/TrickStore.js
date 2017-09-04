var AppDispatcher = require("../dispatcher/AppDispatcher.js");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var RPC = require("../util/RPC.js");

var trick = null, tricks = [], error = null, isLoading = false;

TrickStore = assign(new EventEmitter, {
  IsLoading: function() {
    return isLoading;
  },
  GetError: function() {
    return error;
  },
  GetTrick: function() {
    return trick;
  },
  GetTricks: function() {
    return tricks;
  }
});

TrickStore.DispatchToken = AppDispatcher.register(function(payload) {
  switch (payload.Action) {
  case "TrickView":
    isLoading = true;
    RPC.Call("API.TrickView", [{}], function(res, err) {
      isLoading = false;
      if (err) {
        error = err;
        trick = null;
      } else {
        error = null;
        trick = res.Trick;
      }
      TrickStore.emit("change");
    });
    break;
  case "TrickList":
    isLoading = true;
    RPC.Call("API.TrickList", {}, function(res, err) {
      isLoading = false;
      if (err) {
        error = err;
        tricks = [];
      } else {
        error = null;
        tricks = res.Tricks;
      }
      TrickStore.emit("change");
    });
    break;
  }
});

module.exports = TrickStore;
