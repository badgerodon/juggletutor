var MaskGreenish = function(dst, src) {
  var w = dst.width, h = dst.height;
  for (var x=0; x<w; x++) {
    for (var y=0; y<h; y++) {
      var o = (y*w + x)*4;
      var r = src.data[o+0], g = src.data[o+1], b = src.data[o+2];
      if ((g > r) && (g > b)) {
        dst.data[o+0] = src.data[o+0];
        dst.data[o+1] = src.data[o+1];
        dst.data[o+2] = src.data[o+2];
      } else {
        dst.data[o+0] = 0;
        dst.data[o+1] = 0;
        dst.data[o+2] = 0;
      }
      dst.data[o+3] = 255;
    }
  }
};
