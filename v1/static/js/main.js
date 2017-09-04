navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

function createPNACL(callback) {
    var ui = document.createElement('embed');
    ui.width = 0;
    ui.height = 0;
    ui.addEventListener(
        'load',
        function() {
            if (callback) {
                callback(ui);
                callback = null;
            }
        },
        true
    );
    ui.addEventListener(
        'error',
        function(evt) {
            console.error('FAILED TO LOAD PNACL');
            if (callback) {
                callback(null, evt);
                callback = null;
            }
        },
        true
    );
    ui.addEventListener(
        'crash',
        function(evt) {
            console.log('CRASH', evt);
        },
        true
    );
    ui.type = 'application/x-pnacl';
    ui.src = 'ui.nmf';
    document.body.appendChild(ui);

    return ui;
}

function main() {
    var ui = createPNACL();
    var rpc = new RPC(ui);

    var video = document.createElement('video');
    document.documentElement.appendChild(video);
    video.muted = true;
    video.style.display = 'none';

    navigator.getUserMedia(
        { video: true, audio: false },
        function(stream) {
            var url = window.URL || window.webkitURL;
            video.src = url ? url.createObjectURL(stream) : stream;
            video.play();

            setTimeout(runAnimator, 1000);
        },
        function(error) {
            console.log('failed to load video', error);
        }
    );

    var w = 256;
    var h = 256;

    var offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = w;
    offscreenCanvas.height = h;
    offscreenCanvas.style.display = 'none';
    document.body.appendChild(offscreenCanvas);
    var offscreenContext = offscreenCanvas.getContext('2d');

    var canvas = document.createElement('canvas');
    document.documentElement.appendChild(canvas);
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');

    var buf = ctx.createImageData(w, h);

    function fill(arr, width, height) {
        arr = new Uint8ClampedArray(arr);
        buf.data.set(arr);
        ctx.putImageData(buf, 0, 0);
    }

    //var prev = GFX.CreateImageData(w, h);
    //var tmp = GFX.CreateImageData(w, h);
    //var diffed = GFX.CreateImageData(w, h);

    //var dst = new ImageDataBitmap(GFX.CreateImageData(w, h));
    //var masked = new ImageDataBitmap(GFX.CreateImageData(w, h));

    function runAnimator() {
        //requestAnimationFrame(runAnimator);

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            offscreenContext.drawImage(video, 0, 0, w, h);
            var frame = offscreenContext.getImageData(0, 0, w, h);
            rpc.Call(
                'Track',
                [
                    {
                        Width: frame.width,
                        Height: frame.height,
                        Data: frame.data.buffer
                    }
                ],
                function(result, error) {
                    if (result.Balls) {
                        for (var i = 0; i < result.Balls.length; i++) {
                            var b = result.Balls[i];
                            offscreenContext.strokeRect(
                                b.X1,
                                b.Y1,
                                b.X2 - b.X1,
                                b.Y2 - b.Y1
                            );
                        }
                    }
                    var frame = offscreenContext.getImageData(0, 0, w, h);
                    fill(frame.data, frame.width, frame.height);
                    setTimeout(runAnimator, 100);
                }
            );
        }
    }
}

window.onload = function() {
    main();
};
