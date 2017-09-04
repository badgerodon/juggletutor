var AppDispatcher = require("../dispatcher/AppDispatcher.js");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var RPC = require("../util/RPC.js");
var TrickStore = require("./TrickStore.js");
var values = require("../util/values.js");

var CLIENT_ID = "404331630874.apps.googleusercontent.com";

var currentPage = "Intro";

function handleHistory() {
  var path = location.pathname.substr(1);
  var args = {};
  var ps = location.search.substr(1).split("&");
  for (var i=0; i<ps.length; i++) {
    var nv = ps[i].split("=");
    args[decodeURIComponent(nv[0])] = nv[1];
  }

  if (path === "oauth2callback") {
    var args = {};
    var ps = location.search.substr(1).split("&");
    for (var i=0; i<ps.length; i++) {
      var nv = ps[i].split("=");
      args[decodeURIComponent(nv[0])] = decodeURIComponent(nv[1]);
    }
    this.rpc.call("API.GetAccessToken", [{
      Code: args.code,
      State: args.state
    }], (function(res, err) {
      if (err) {
        console.warn("error retrieving auth url: " + err);
        this._changePage("Intro");
        return;
      }
      localStorage.setItem("AccessToken.Token", res.AccessToken);
      localStorage.setItem("AccessToken.Expires", new Date(res.Expires).getTime());
      this._changePage(this._returnPage || "TrickList", {}, true);
    }).bind(this));
  } else if (path === "TrickView") {
    if (args.ID) {
      this.rpc.call("API.GetTrick", [{
        ID: args.ID
      }], (function(res, err) {
        this._page = "TrickView";
        this._error = err;
        this._trick = res;
        this.emit("change");
      }).bind(this));
    } else {
      this._changePage("TrickList", {}, true);
    }
  } else if (this._page !== path) {
    this._page = path;
    AppStore.emit("change");
  }
}

var AppStore = assign(new EventEmitter, {
  GetAccessToken: function() {
    var token = localStorage.getItem("AccessToken.Token");
    var expires = localStorage.getItem("AccessToken.Expires");
    if (token && expires && +expires > new Date().getTime()) {
      return token;
    }
    return null;
  },
  GetPage: function() {
    return currentPage;
  }
});

function handleHistoryChange() {
  var action = location.pathname.substr(1) || "Intro";
  var obj = {
    "Action": action,
    "_skipHistory": true
  };
  var args = values.Parse(location.search);
  for (var k in args) {
    obj[k] = args[k];
  }
  AppDispatcher.dispatch(obj);
}

AppStore.DispatchToken = AppDispatcher.register(function(payload) {
  var nextPage;
  switch (payload.Action) {
  case "Intro":
    nextPage = "Intro";
    break;
  case "TrickList":
    AppDispatcher.waitFor([TrickStore.DispatchToken]);
    nextPage = "TrickList";
    break;
  case "TrickView":
    AppDispatcher.waitFor([TrickStore.DispatchToken]);
    nextPage = "TrickView";
    break;
  }
  if (nextPage) {
    var args = {};
    for (var k in payload) {
      if (k !== "Action" && k.substr(0, 1) !== "_") {
        args[k] = payload[k];
      }
    }
    if (nextPage !== currentPage) {
      currentPage = nextPage;
      if (!payload._skipHistory) {
        history.pushState({}, null, "/" + nextPage + values.Encode(args));
      }
      AppStore.emit("change");
    }
  }
});

window.addEventListener("popstate", handleHistoryChange);
window.addEventListener("load", handleHistoryChange);

module.exports = AppStore;
