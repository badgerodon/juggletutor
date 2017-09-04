var nextID = 1;
var RPC = {
  Call: function(method, params, callback) {
    if (!(params instanceof Array)) {
      params = [params || {}];
    }

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(evt) {
      if (xhr.readyState === 4) {
        if (callback) {
          var obj = xhr.responseText;
          try {
            obj = JSON.parse(obj);
          } catch(e) {}
          console.log("[RPC] <<<", obj);
          if (xhr.status !== 200) {
            callback(null, obj && obj.error || obj);
          } else {
            if (obj && obj.error) {
              callback(null, obj.error)
            } else {
              callback(obj.result, null);
            }
          }
          callback = null;
        }
      }
    };
    xhr.open("POST", "/rpc");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    var obj = {
      "method": method,
      "params": params,
      "id": nextID++
    };
    console.log("[RPC] >>>", obj);
    var data = JSON.stringify(obj);
    xhr.send(data);
  }
};

module.exports = RPC;
