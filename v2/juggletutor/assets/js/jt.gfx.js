(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

(function() {

function drawEllipse(ctx, x, y, w, h) {
  var kappa = .5522848;
      ox = (w / 2) * kappa, // control point offset horizontal
      oy = (h / 2) * kappa, // control point offset vertical
      xe = x + w,           // x-end
      ye = y + h,           // y-end
      xm = x + w / 2,       // x-middle
      ym = y + h / 2;       // y-middle

  ctx.beginPath();
  ctx.moveTo(x, ym);
  ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
  ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
  ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
  ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
  ctx.closePath();
  ctx.stroke();
}

function strokeCircle(ctx, x, y, r) {
  ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI*2, false);
  ctx.stroke();
}
function fillCircle(ctx, x, y, r) {
  ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI*2, false);
  ctx.fill();
}

var objects = [];

var GFX = function(canvas) {
	this.canvas = canvas;
	this.context = this.canvas.getContext("2d");
};
GFX.prototype = {
	render: function() {
		ctx = this.context;
		ctx.clearRect(0, 0, 500, 500);
		drawEllipse(ctx, 157, 22, 87, 112);
		ctx.beginPath();
		ctx.moveTo(101, 155);
		ctx.lineTo(301, 155);
		ctx.lineTo(274, 349);
		ctx.lineTo(127, 349);
		ctx.lineTo(101, 155);
		ctx.stroke();

		fillCircle(ctx, 200, 200, 20);
	}
};

var animator = function(time) {
	_.each(objects, function(gfx) {
		gfx.render(time);
	});
	requestAnimationFrame(animator);
};
animator();

var mark = true;
setInterval(function() {
	// mark / create
	$("canvas").each(function() {
		if (!this._gfx) {
			this._gfx = new GFX(this);
			$(this).css({
				"width": 500 + "px",
				"height": 500 + "px"
			}).attr({
				"width": 500,
				"height": 500
			});
			objects.push(this._gfx);
		}
		this._gfx.mark = mark;
	});
	// sweep
	for (var i=0; i<objects.length; i++) {
		if (objects[i].mark !== mark) {
			delete objects[i].canvas._gfx;
			objects.splice(i, 1);
			i--;
		}
	}
	mark = !mark;
}, 1000);

})();
