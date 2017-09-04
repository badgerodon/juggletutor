var Queue = function() {
  this.front = this.back = null;
  this.size = 0;
};
Queue.prototype = {
  Enqueue: function(item) {
    var node = [null, item, null];
    if (this.front === null) {
      this.back = this.front = node;
    } else {
      this.back[2] = node;
      node[0] = this.back;
      this.back = node;
    }
    this.size++;
  },
  Dequeue: function() {
    if (this.front === null) {
      return null;
    }
    var node = this.front;
    if (this.front === this.back) {
      this.front = this.back = null;
    } else {
      this.front = node[2];
    }
    this.size--;
    return node[1];
  },
  Size: function() {
    return this.size;
  }
};
