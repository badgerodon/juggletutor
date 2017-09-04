
var LabelComponents, FindNBiggestBlobs;

(function() {

FindNBiggestBlobs = function(scratch, src, n) {
  //var tree = new AVLTree();
  LabelComponents(scratch, src, null);
  /*var components = [];
  var iterator = tree.GetIterator(true);
  while (iterator.Next()) {
    components.push(iterator.Value());
    if (components.length === n) {
      break;
    }
  }
  return components;
  */
  return []
};

/**
 * Label the components of an image. `src` should be a binary bitmap.
 *   `dst` should be bitmap
 */
LabelComponents = function(scratch, src, tree) {
  if (scratch.width !== src.width || scratch.height != src.height) {
    throw "`scratch` and `src` must have the same dimensions";
  }

  var w = scratch.width, h = scratch.height;
  var stack = new Stack();
  var current = 1;
  var processPixel = function() {
    var size = 0, rect = new Rectangle(x, y, 1, 1);

    stack.Push([x,y]);
    while (stack.Size() > 0) {
      var p = stack.Pop(), px = p[0], py = p[1];
      var o = (py*w + px) * 4;
      scratch.data[o+0] = current;
      scratch.data[o+1] = current;
      scratch.data[o+2] = current;
      scratch.data[o+3] = current;

      rect.X = Math.min(px, rect.X);
      rect.Y = Math.min(py, rect.Y);
      rect.Width = Math.max(px-rect.X, rect.Width);
      rect.Height = Math.max(py-rect.Y, rect.Height);
      size++;


      if (px > 0 && dst.Get(px-1, py) === 0 && src.Get(px-1, py)) {
        stack.Push([px-1, py]);
      }
      if (px < w && dst.Get(px+1, py) === 0 && src.Get(px+1, py)) {
        stack.Push([px+1, py]);
      }
      if (py > 0 && dst.Get(px, py-1) === 0 && src.Get(px, py-1)) {
        stack.Push([px, py-1]);
      }
      if (py < h && dst.Get(px, py+1) === 0 && src.Get(px, py+1)) {
        stack.Push([px, py+1]);
      }
    }

    if (tree) {
      // add a little noise so we can (roughly) store duplicates
      tree.Set(size + Math.random(), rect);
    }
  };

  // Clear the destination
  for (var i=0; i<scratch.data.length; i++) {
    scratch.data[i] = 0;
  }

  // For each pixel in src
  for (var x=0; x<w; x++) {
    for (var y=0; y<h; y++) {
      var o = (y*w + x) * 4;
      // if we already processed this pixel
      if (scratch.data[o] > 0) {
        continue;
      }
      if (src.data[o] > 0) {
        //processPixel();
        //current++;
        scratch.data[o+0] = 255;
        scratch.data[o+1] = 0;
        scratch.data[o+2] = 0;
        scratch.data[o+3] = 255;
      }
    }
  }
};

})();
