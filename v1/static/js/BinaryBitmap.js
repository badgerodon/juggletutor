var BinaryBitmap = function(width, height) {
  this.Width = width;
  this.Height = height;
  //TODO: we can store these as bits instead of bytes
  this.data = new Uint8Array(width*height);
};
BinaryBitmap.prototype = {
  Get: function(x, y) {
    var o = y*this.Width + x;
    return this.data[o] > 0;
  },
  Set: function(x, y, v) {
    var o = y*this.Width + x;
    this.data[o] = v ? 1 : 0;
  }
};
