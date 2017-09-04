var Stack = function() {
  this.stack = [];
};
Stack.prototype = {
  Pop: function() {
    return this.stack.pop();
  },
  Push: function(item) {
    this.stack.push(item);
  },
  Size: function() {
    return this.stack.length;
  }
};
