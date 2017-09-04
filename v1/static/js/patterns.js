var Tracker = function(capacity) {
  // stored as a flattened (time-hi, time-lo, x, y) array
  // good for a 256 x 256 grid, and about an hour
  this.capacity = capacity;
  this.length = 0;
  this.offset = 0;
  this.buffer = new Uint8Array(this.capacity*4);
  this.epoch = new Date().getTime();
};
Tracker.prototype = {
  Record: function(x, y) {
    var tm = new Date().getTime() - this.epoch;
    var pos = this.offset*4;
    this.buffer[pos+0] = (tm >> 8) % 256;
    this.buffer[pos+1] = tm % 256;
    this.buffer[pos+2] = x;
    this.buffer[pos+3] = y;
    this.offset = (this.offset+1) % this.capacity;
    this.length = (this.length+1) % this.capacity;
  },
  PositionAt: function(time) {
    var target = time - this.epoch;
    var current = new Date().getTime() - this.epoch;
    var x, y;
    for (var i=1; i<=this.length; i++) {
      var pos = this.offset-i;
      if (pos < 0) {
        pos = this.length - pos;
      }
      pos *= 4;
      x = this.buffer[pos+2];
      y = this.buffer[pos+3];
      if (current < target) {
        console.log("TIME", target, current);
        break;
      }
      current =(this.buffer[pos+0] << 8) + (this.buffer[pos+1]);
    }
    return [x, y];
  }
};
