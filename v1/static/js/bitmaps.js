var Color = function(rgba, g, b, a) {
  if (arguments.length > 1) {
    this.R = r;
    this.G = g;
    this.B = b;
    this.A = a;
  } else {
    this.R = (rgba >> 24);
    this.G = (rgba >> 16) % (1 << 24);
    this.B = (rgba >>  8) % (1 << 16);
    this.A = (rgba >>  0) % (1 <<  8);
  }
};

var Uint8Bitmap = function(width, height) {
  this.Width = width;
  this.Height = height;
  this.data = new Uint8Array(width*height);
};
Uint8Bitmap.prototype = {
  Get: function(x, y) {
    var o = y*this.Width + x;
    return this.data[o];
  },
  Set: function(x, y, v) {
    var o = y*this.Width + x;
    this.data[o] = v;
  }
};

var Uint16Bitmap = function(width, height, data) {
  this.Width = width;
  this.Height = height;
  this.data = data || new Uint8Array(width*height*2);
};
Uint16Bitmap.prototype = {
  Get: function(x, y) {
    var o = (y*this.Width + x) * 2;
    return (this.data[o] << 8) + this.data[o+1];
  },
  Set: function(x, y, v) {
    var o = (y*this.Width + x) * 2;
    this.data[o] = v >> 8;
    this.data[o+1] = v % 256;
  }
};

var Uint32Bitmap = function(width, height, data) {
  this.Width = width;
  this.Height = height;
  this.data = data || new Uint8Array(width*height*4);
};
Uint32Bitmap.prototype = {
  Get: function(x, y) {
    var o = (y*this.Width + x) * 4;
    return (this.data[o+0] << 24) +
           (this.data[o+1] << 16) +
           (this.data[o+2] <<  8) +
           (this.data[o+3] <<  0);
  },
  Set: function(x, y, v) {
    var o = (y*this.Width + x) * 4;
    this.data[o+0] = (v >> 24);
    this.data[o+1] = (v >> 16) % (1 << 24);
    this.data[o+2] = (v >>  8) % (1 << 16);
    this.data[o+3] = (v >>  0) % (1 <<  8);
  }
};

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


var ImageDataBitmap = function(imageData) {
  this.imageData = imageData;
};
ImageDataBitmap.prototype = {
  Fill: function(bmp) {
    if (bmp instanceof ImageDataBitmap) {
      for (var i=0; i<bmp.imageData.data.length; i++) {
        this.imageData.data[i] = bmp.imageData.data[i];
      }
    } else {
      var w = this.imageData.width, h = this.imageData.height;
      for (var x=0; x<w; x++) {
        for (var y=0; y<h; y++) {
          this.Set(x, y, bmp.Get(x, y));
        }
      }
    }
  },
  Get: function(x, y) {
    var o = (y*this.imageData.width + x) * 4;
    return new Color(
      this.imageData.data[o+0],
      this.imageData.data[o+1],
      this.imageData.data[o+2],
      this.imageData.data[o+3]
    );
  },
  Set: function(x, y, color) {
    var o = (y*this.imageData.width + x) * 4;
    this.imageData.data[o+0] = color.R;
    this.imageData.data[o+1] = color.G;
    this.imageData.data[o+2] = color.B;
    this.imageData.data[o+3] = color.A;
  }
};
