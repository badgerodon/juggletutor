


var RGBBitmap = function(width, height) {
  this.width = width;
  this.height = height;
  this.data = new Uint8Array(width*height*3);
};
RGBBitmap.prototype.Each = function(callback) {
  var w = this.width,
      h = this.height,
      d = this.data;
  for (var x=0; x<w; x++) {
    for (var y=0; y<h; y++) {
      var o = (y*w + x) * 3;
      callback(x, y, d[o+0], d[o+1], d[o+2], 255);
    }
  }
};

var BallTracker = function() {
  this.scratch = new RGBBitmap(256, 256);
};
BallTracker.prototype = {
  Track: function(bitmap) {
    var w = imageData.width,
        h = imageData.height;
    for (var x=0; x<w; x++) {
      for (var y=0; y<h; y++) {
        var o = (y*w + x) * 4;
        var r = imageData.data[o+0],
            g = imageData.data[o+1],
            b = imageData.data[o+2];
        if (g > 200 && r < 100 && b < 100) {
          console.log(x,y);
          return;
        }
      }
    }
  },
  Mask: function(bitmap) {
    bitmap.Each((function(x, y, color) {
      if (!this.IsGreenish(color)) {
        bitmap.Set(x, y, new Color(0, 0, 0, 255));
      }
    }).bind(this));
  },
  IsGreenish: function(color) {
    return (color.G-color.R) > 0 && (color.G-color.B) > 0;
  }
};
