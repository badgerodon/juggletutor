var Vector = function(length, capacity) {
  this.Length = length;
  this.Capacity = capacity;
};
Vector.prototype = {
  Resize: function(length, capacity) {
    if (capacity === undefined) {

    }

    var old = this.Array;
    this.Array = new Uint8ClampedArray(capacity);
    if (old) {
      var n = Math.min(length, this.Length);
      for (var i=0; i<n; i++) {
        this.Array[i] = old[i];
      }
    }
    this.Length = length;
    this.Capacity = capacity;
  }
};
