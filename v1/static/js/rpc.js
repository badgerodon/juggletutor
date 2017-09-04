var RPC = function(element) {
  this.element = element;
  this.nextID = 1;
  var callbacks = this.callbacks = {};

  this.element.addEventListener("message", function(evt) {
    var id = evt.data.id;
    if (callbacks[id]) {
      var cb = callbacks[id];
      delete callbacks[id];
      setTimeout(function() {
        cb(evt.data.result, evt.data.error);
      }, 0);
    }
  }, true);
};
RPC.prototype = {
  Call: function(method, params, callback) {
    var id = this.nextID++;
    this.callbacks[id] = callback;
    this.element.postMessage({
      method: method,
      params: params,
      id: id
    });
  }
};
