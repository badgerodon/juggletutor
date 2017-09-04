var AVLTreeNode = function(key, value, left, right, height) {
  this.Key = key;
  this.Value = value;
  this.Left = left;
  this.Right = right;
  this.Height = height;
};

var AVLTreeIterator = function(tree, reverse) {
  this.stack = new Stack();
  this.reverse = reverse;
  if (tree.root) {
    this.stack.Push([tree.root, 0]);
  }
  this.key = null;
  this.value = null;
};
AVLTreeIterator.prototype = {
  Next: function() {
    var entry = this.stack.Pop();
    if (!entry) {
      return false;
    }
    var node = entry[0], step = entry[1];

    // go right
    if (step === 2) {
      if (this.reverse ? node.Left : node.Right) {
        node = this.reverse ? node.Left : node.Right;
        step = 0;
      } else {
        return this.Next();
      }
    }

    // go left as far as possible
    if (step === 0) {
      while (this.reverse ? node.Right : node.Left) {
        this.stack.Push([node, 1])
        node = this.reverse ? node.Right : node.Left;
      }
      step = 1;
    }

    if (step === 1) {
      this.stack.Push([node, 2]);
      this.key = node.Key;
      this.value = node.Value;
    }

    return true;
  },
  Key: function() {
    return this.key;
  },
  Value: function() {
    return this.value;
  }
};

var AVLTree = function() {
  this.size = 0;
  this.root = null;
};
AVLTree.prototype = {
  //TODO: implement delete
  Delete: function(key) {

  },
  Get: function(key) {
    return this.get(this.root, key);
  },
  GetIterator: function(reverse) {
    return new AVLTreeIterator(this, reverse);
  },
  Set: function(key, value) {
    this.root = this.set(this.root, key, value);
  },
  Size: function() {
    return this.size;
  },

  get: function(node, key) {
    while (node) {
      if (key < node.Key) {
        node = node.Left;
      } else if (key > node.Key) {
        node = node.Right;
      } else {
        return node.Value;
      }
    }
    return undefined;
  },
  set: function(node, key, value) {
    if (node === null) {
      this.size++;
      return new AVLTreeNode(key, value, null, null, 1);
    }
    if (key < node.Key) {
      node.Left = this.set(node.Left, key, value);
    } else if (key > node.Key) {
      node.Right = this.set(node.Right, key, value);
    } else {
      node.Value = value;
    }
    return this.balance(node);
  },
  balance: function(node) {
    var lh = (node.Left && node.Left.Height) || 0,
        rh = (node.Right && node.Right.Height) || 0;
    var bf = lh - rh;
    // left-right or left-left
    if (bf === 2) {
      var llh = (node.Left.Left && node.Left.Left.Height) || 0,
          lrh = (node.Left.Right && node.Left.Right.Height) || 0;
      if (lrh > llh) {
        node.Left = this.rotateLeft(node.Left);
      }
      node = this.rotateRight(node);
    // right-elft or right-right
    } else if (bf === -2) {
      var rlh = (node.Right.Left && node.Right.Left.Height) || 0,
          rrh = (node.Right.Right && node.Right.Right.Height) || 0;
      if (rlh > rrh) {
        node.Right = this.rotateRight(node.Right);
      }
      node = this.rotateLeft(node);
    }
    node.Height = Math.max(lh, rh) + 1;
    return node;
  },
  rotateLeft: function(node) {
    var right = node.Right;
    node.Right = node.Right.Left;
    right.Left = node;
    return right;
  },
  rotateRight: function(node) {
    var left = node.Left;
    node.Left = node.Left.Right;
    left.Right = node;
    return left;
  }
};
