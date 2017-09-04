module.exports = {
  Encode: function(values) {
    var str = "";
    for (var k in values) {
      if (str) {
        str += "&";
      } else {
        str += "?";
      }
      str += encodeURIComponent(k) + "=" + encodeURIComponent(values[k]);
    }
    return str;
  },
  Parse: function(str) {
    if (str.substr(0, 1) === "?") {
      str = str.substr(1);
    }
    if (!str) {
      return {};
    }
    var values = {};
    var ps = str.split("&");
    for (var i=0; i<ps.length; i++) {
      var nv = ps[i].split("=");
      if (nv.length > 1) {
        values[decodeURIComponent(nv[0])] = decodeURIComponent(nv.slice(1).join("="));
      } else {
        values[decodeURIComponent(nv[0])] = "on";
      }
    }
    return values;
  }
}
