jt.Util = {
  SortAttributes: function(arr) {
    var getName = function(o) {
      var name = o.Name || "";
      name = name.toUpperCase();
      switch (name) {
      case "FAMILY":
        return "     a";
      case "STYLE":
        return "     b";
      case "COUNT":
        return "     c";
      }
      return name;
    }

    arr.sort(function(a, b) {
      var av = getName(a);
      var bv = getName(b);
      return av > bv ? 1 : av < bv ? -1 : 0;
    });
  }
};