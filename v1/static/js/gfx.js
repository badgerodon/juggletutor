var GFX = {};

GFX.CreateImageData = function(width, height) {
    if (!GFX._ctx) {
        GFX._ctx = document.createElement('canvas').getContext('2d');
    }
    return GFX._ctx.createImageData(width, height);
};

GFX.each = function(src, callback) {
    var w = src.width,
        h = src.height;
    for (var x = 0; x < w; x++) {
        for (var y = 0; y < h; y++) {
            callback((y * w + x) * 4, x, y);
        }
    }
}

GFX.Convolve = function(dst, src, matrix) {
    var sz = Math.round(Math.sqrt(matrix.length)),
        hsz = Math.floor(sz / 2),
        w = src.width,
        h = src.height,
        dd = dst.data,
        sd = src.data;

    GFX.each(src, function(i, x, y) {
        dd[i + 0] = dd[i + 1] = dd[i + 2] = 0;
        dd[i + 3] = sd[i + 3];
        for (var mx = 0; mx < sz; mx++) {
            for (var my = 0; my < sz; my++) {
                var cx = x + hsz - mx,
                    cy = y + hsz - my;
                if (cx < 0 || cy < 0 || cx >= w || cy >= h) {
                    continue;
                }
                var j = (cy * w + cx) * 4,
                    wt = matrix[my * sz + mx];
                dd[i + 0] += sd[j + 0] * wt;
                dd[i + 1] += sd[j + 1] * wt;
                dd[i + 2] += sd[j + 2] * wt;
            }
        }
    });
};

GFX.VerticalConvolve = function(dst, src, weightsVector, opaque) {
    var side = weightsVector.length;
    var halfSide = Math.floor(side / 2);

    var sd = src.data;
    var sw = src.width;
    var sh = src.height;

    var w = sw;
    var h = sh;
    var dd = dst.data;

    var alphaFac = opaque ? 1 : 0;

    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            var sy = y;
            var sx = x;
            var ddOff = (y * w + x) * 4;
            var r = 0,
                g = 0,
                b = 0,
                a = 0;
            for (var cy = 0; cy < side; cy++) {
                var scy = Math.min(sh - 1, Math.max(0, sy + cy - halfSide));
                var scx = sx;
                var sdOff = (scy * sw + scx) * 4;
                var wt = weightsVector[cy];
                r += sd[sdOff] * wt;
                g += sd[sdOff + 1] * wt;
                b += sd[sdOff + 2] * wt;
                a += sd[sdOff + 3] * wt;
            }
            dd[ddOff] = r;
            dd[ddOff + 1] = g;
            dd[ddOff + 2] = b;
            dd[ddOff + 3] = a + alphaFac * (255 - a);
        }
    }
};

GFX.HorizontalConvolve = function(dst, src, weightsVector, opaque) {
    var side = weightsVector.length;
    var halfSide = Math.floor(side / 2);

    var sd = src.data;
    var sw = src.width;
    var sh = src.height;

    var w = sw;
    var h = sh;
    var dd = dst.data;

    var alphaFac = opaque ? 1 : 0;

    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            var sy = y;
            var sx = x;
            var ddOff = (y * w + x) * 4;
            var r = 0,
                g = 0,
                b = 0,
                a = 0;
            for (var cx = 0; cx < side; cx++) {
                var scy = sy;
                var scx = Math.min(sw - 1, Math.max(0, sx + cx - halfSide));
                var sdOff = (scy * sw + scx) * 4;
                var wt = weightsVector[cx];
                r += sd[sdOff] * wt;
                g += sd[sdOff + 1] * wt;
                b += sd[sdOff + 2] * wt;
                a += sd[sdOff + 3] * wt;
            }
            dd[ddOff] = r;
            dd[ddOff + 1] = g;
            dd[ddOff + 2] = b;
            dd[ddOff + 3] = a + alphaFac * (255 - a);
        }
    }
};

GFX.SeparableConvolve = function(dst, src, horizWeights, vertWeights, opaque) {
    var tmp = GFX.CreateImageData(src.width, src.height);
    GFX.HorizontalConvolve(tmp, src, horizWeights, opaque);
    GFX.VerticalConvolve(dst, tmp, horizWeights, opaque);
};

GFX.Copy = function(dst, src) {
    var sd = src.data,
        dd = dst.data;
    for (var i = 0; i < sd.length; i++) {
        dd[i] = sd[i];
    }
};

GFX.GaussianBlur = function(dst, src, diameter) {
    diameter = Math.abs(diameter);
    if (diameter <= 1) return GFX.Copy(dst, src);
    var radius = diameter / 2;
    var len = Math.ceil(diameter) + (1 - (Math.ceil(diameter) % 2))
    var weights = new Float32Array(len);
    var rho = (radius + 0.5) / 3;
    var rhoSq = rho * rho;
    var gaussianFactor = 1 / Math.sqrt(2 * Math.PI * rhoSq);
    var rhoFactor = -1 / (2 * rho * rho)
    var wsum = 0;
    var middle = Math.floor(len / 2);
    for (var i = 0; i < len; i++) {
        var x = i - middle;
        var gx = gaussianFactor * Math.exp(x * x * rhoFactor);
        weights[i] = gx;
        wsum += gx;
    }
    for (var i = 0; i < weights.length; i++) {
        weights[i] /= wsum;
    }
    GFX.SeparableConvolve(dst, src, weights, weights, false);
};

GFX.Grayscale = function(dst, src) {
    var dd = dst.data,
        sd = src.data;
    for (var i = 0; i < sd.length; i += 4) {
        var v = 0.3 * sd[i + 0] + 0.59 * sd[i + 1] + 0.11 * sd[i + 2];
        dd[i + 0] = dd[i + 1] = dd[i + 2] = v;
        dd[i + 3] = sd[i + 3];
    }
};

GFX.VerticalConvolveFloat32 = function(dst, src, weightsVector, opaque) {
    var side = weightsVector.length;
    var halfSide = Math.floor(side / 2);

    var sd = src.data;
    var sw = src.width;
    var sh = src.height;

    var w = sw;
    var h = sh;
    var dd = dst;

    var alphaFac = opaque ? 1 : 0;

    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            var sy = y;
            var sx = x;
            var ddOff = (y * w + x) * 4;
            var r = 0,
                g = 0,
                b = 0,
                a = 0;
            for (var cy = 0; cy < side; cy++) {
                var scy = Math.min(sh - 1, Math.max(0, sy + cy - halfSide));
                var scx = sx;
                var sdOff = (scy * sw + scx) * 4;
                var wt = weightsVector[cy];
                r += sd[sdOff] * wt;
                g += sd[sdOff + 1] * wt;
                b += sd[sdOff + 2] * wt;
                a += sd[sdOff + 3] * wt;
            }
            dd[ddOff] = r;
            dd[ddOff + 1] = g;
            dd[ddOff + 2] = b;
            dd[ddOff + 3] = a + alphaFac * (255 - a);
        }
    }
};
GFX.HorizontalConvolveFloat32 = function(dst, src, weightsVector, opaque) {
    var side = weightsVector.length;
    var halfSide = Math.floor(side / 2);

    var sd = src.data;
    var sw = src.width;
    var sh = src.height;

    var w = sw;
    var h = sh;
    var dd = dst.data;

    var alphaFac = opaque ? 1 : 0;

    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            var sy = y;
            var sx = x;
            var ddOff = (y * w + x) * 4;
            var r = 0,
                g = 0,
                b = 0,
                a = 0;
            for (var cx = 0; cx < side; cx++) {
                var scy = sy;
                var scx = Math.min(sw - 1, Math.max(0, sx + cx - halfSide));
                var sdOff = (scy * sw + scx) * 4;
                var wt = weightsVector[cx];
                r += sd[sdOff] * wt;
                g += sd[sdOff + 1] * wt;
                b += sd[sdOff + 2] * wt;
                a += sd[sdOff + 3] * wt;
            }
            dd[ddOff] = r;
            dd[ddOff + 1] = g;
            dd[ddOff + 2] = b;
            dd[ddOff + 3] = a + alphaFac * (255 - a);
        }
    }
};
GFX.SeparableConvolveFloat32 = function(dst, src, horizWeights, vertWeights, opaque) {
    var tmp = GFX.CreateImageData(src.width, src.height);
    GFX.VerticalConvolveFloat32(tmp, src, vertWeights, opaque);
    GFX.HorizontalConvolve(dst, tmp, horizWeights, opaque);
};


GFX.sobelSignVector = new Float32Array([-1, 0, 1]);
GFX.sobelScaleVector = new Float32Array([1, 2, 1]);

GFX.sobelVerticalGradient = function(dst, src) {
    GFX.SeparableConvolveFloat32(dst, src, GFX.sobelSignVector, GFX.sobelScaleVector);
};

GFX.sobelHorizontalGradient = function(dst, src) {
    GFX.SeparableConvolveFloat32(dst, src, GFX.sobelScaleVector, GFX.sobelSignVector);
};

GFX.sobelVectors = function(px) {
    var vertical = this.sobelVerticalGradient(px);
    var horizontal = this.sobelHorizontalGradient(px);
    var id = {
        width: vertical.width,
        height: vertical.height,
        data: this.getFloat32Array(vertical.width * vertical.height * 8)
    };
    var vd = vertical.data;
    var hd = horizontal.data;
    var idd = id.data;
    for (var i = 0, j = 0; i < idd.length; i += 2, j++) {
        idd[i] = hd[j];
        idd[i + 1] = vd[j];
    }
    return id;
};

GFX.sobelHorizontalMatrix = new Float32Array([-1, 0, 1, -2, 0, 2, -1, 0, 1]);
GFX.sobelVerticalMatrix = new Float32Array([1, 2, 1, 0, 0, 0, -1, -2, -1]);

GFX.Sobel = function(dst, src) {
    var len = src.width * src.height * 4;
    if (GFX.Sobel._len !== len) {
        GFX.Sobel._gxd = new Float32Array(len);
        GFX.Sobel._gyd = new Float32Array(len);
        GFX.Sobel._len = len;
    }

    var dd = dst.data,
        sd = src.data,
        gxd = GFX.Sobel._gxd,
        gyd = GFX.Sobel._gyd,
        gx = {
            data: gxd,
            width: src.width,
            height: src.height
        },
        gy = {
            data: gyd,
            width: src.width,
            height: src.height
        };
    GFX.Convolve(gx, src, GFX.sobelHorizontalMatrix);
    GFX.Convolve(gy, src, GFX.sobelVerticalMatrix);

    GFX.each(src, function(i, x, y) {
        dd[i + 0] = Math.abs(gxd[i + 0]) + Math.abs(gyd[i + 0]);
        dd[i + 1] = Math.abs(gxd[i + 1]) + Math.abs(gyd[i + 1]);
        dd[i + 2] = Math.abs(gxd[i + 2]) + Math.abs(gyd[i + 2]);
        dd[i + 3] = sd[i + 3];
    });
};

GFX.RGBToHSV = function(r, g, b) {
    var h = 0,
        mx = Math.max(r, g, b),
        mn = Math.min(r, g, b),
        dif = mx - mn;

    if (mx == r) {
        h = (g - b) / dif;
    } else if (mx == g) {
        h = 2 + ((g - r) / dif)
    } else {
        h = 4 + ((r - g) / dif);
    }
    h = h * 60;
    if (h < 0) {
        h = h + 360;
    }

    return [h, 1 - (3 * ((Math.min(r, g, b)) / (r + g + b))), (1 / 3) * (r + g + b)];
};

GFX.Normalize = function(r, g, b) {
    var sum = r + g + b;
    return [(r / sum), (g / sum), (b / sum)];
};

GFX.SkinMask = function(dst, src) {
    var dd = dst.data,
        sd = src.data;
    GFX.each(src, function(i, x, y) {
        var r = sd[i + 0],
            g = sd[i + 1],
            b = sd[i + 2],
            nrgb = GFX.Normalize(r, g, b),
            nr = nrgb[0],
            ng = nrgb[1],
            nb = nrgb[2],
            hsv = GFX.RGBToHSV(r, g, b),
            h = hsv[0],
            s = hsv[1],
            v = hsv[2];

        var rgbClassifier = ((r > 95) && (g > 40 && g < 100) && (b > 20) && ((Math.max(r, g, b) - Math.min(r, g, b)) > 15) && (Math.abs(r - g) > 15) && (r > g) && (r > b));
        var normRgbClassifier = (((nr / ng) > 1.185) && (((r * b) / (Math.pow(r + g + b, 2))) > 0.107) && (((r * g) / (Math.pow(r + g + b, 2))) > 0.112));
        var hsvClassifier = (h > 0 && h < 35 && s > 0.23 && s < 0.68);

        if (rgbClassifier || normRgbClassifier || hsvClassifier) {
            dd[i + 0] = r;
            dd[i + 1] = g;
            dd[i + 2] = b;
        } else {
            dd[i + 0] = dd[i + 1] = dd[i + 2] = 0;
        }
        dd[i + 3] = sd[i + 3];
    });
};

GFX.Invert = function(dst, src) {
    var dd = dst.data,
        sd = src.data;
    GFX.each(src, function(i, x, y) {
        dd[i + 0] = 255 - sd[i + 0];
        dd[i + 1] = 255 - sd[i + 1];
        dd[i + 2] = 255 - sd[i + 2];
        dd[i + 3] = sd[i + 3];
    });
};

GFX.Mask = function(dst, src, mask) {
    var dd = dst.data,
        sd = src.data,
        md = mask.data;
    GFX.each(src, function(i, x, y) {
        dd[i + 0] = md[i + 0] ? sd[i + 0] : 0;
        dd[i + 1] = md[i + 1] ? sd[i + 1] : 0;
        dd[i + 2] = md[i + 2] ? sd[i + 2] : 0;
        dd[i + 3] = sd[i + 3];
    });
};

GFX.Threshold = function(dst, src, filter) {
    var dd = dst.data,
        sd = src.data;
    GFX.each(src, function(i, x, y) {
        if (filter(sd[i + 0], sd[i + 1], sd[i + 2])) {
            dd[i + 0] = sd[i + 0];
            dd[i + 1] = sd[i + 1];
            dd[i + 2] = sd[i + 2];
        } else {
            dd[i + 0] = dd[i + 1] = dd[i + 2] = 0;
        }
        dd[i + 3] = sd[i + 3];
    });
};

GFX.GetComponents = function(src) {
    var components = [],
        sd = src.data,
        w = src.width,
        h = src.height,
        set = new DisjointSet(w * h);
    GFX.each(src, function(i, x, y) {
        // Not black
        if (sd[i + 0] > 0 || sd[i + 1] > 0 || sd[i + 2] > 0) {
            var candidates = [];
            for (var nx = Math.max(0, x - 1); nx < Math.min(x + 1, w); nx++) {
                for (var ny = Math.max(0, y - 1); ny < Math.min(y + 1, h); ny++) {
                    var j = (ny * w + nx) * 4;
                    if (sd[j + 0] > 0 || sd[j + 1] > 0 || sd[j + 2] > 0) {
                        candidates.push(j);
                    }
                }
            }
            candidates.sort();
            if (candidates.length) {
                set.union(i, candidates[0]);
            }
        }
    });

    var lookup = {};
    console.log(set);
};

GFX.GrassFire = function(dst, src, initial) {
    var w = initial.width,
        h = initial.height,
        dd = dst.data,
        sd = src.data,
        id = initial.data;

    function notBlack(d, i) {
        return d[i + 0] > 0 || d[i + 1] > 0 || d[i + 2] > 0;
    }

    GFX.each(dst, function(i, x, y) {
        dd[i + 0] = dd[i + 1] = dd[i + 2] = 0;
        dd[i + 3] = 255;
    });
    GFX.each(initial, function(i, x, y) {
        // if set in initial
        if (notBlack(id, i)) {
            dd[i + 0] = sd[i + 0];
            dd[i + 1] = sd[i + 1];
            dd[i + 2] = sd[i + 2];
            var candidates = [
                [x, y]
            ];
            while (candidates.length) {
                var c = candidates.pop(),
                    nx = c[0],
                    ny = c[1],
                    j = (ny * w + nx) * 4;
                if (notBlack(dd, j)) {
                    continue;
                } else if (notBlack(sd, j)) {
                    dd[j + 0] = sd[j + 0];
                    dd[j + 1] = sd[j + 1];
                    dd[j + 2] = sd[j + 2];
                    candidates.push([nx + 1, ny], [nx - 1, ny], [nx, ny + 1], [nx, ny - 1]);
                }
            }
        }
    });
};

GFX.Diff = function(dst, src1, src2) {
    var sd1 = src1.data,
        sd2 = src2.data,
        dd = dst.data,
        w = src1.width,
        h = src1.height;

    GFX.each(src1, function(i, x, y) {
        dd[i + 0] = sd1[i + 0] - sd2[i + 0];
        dd[i + 1] = sd1[i + 1] - sd2[i + 1];
        dd[i + 2] = sd1[i + 2] - sd2[i + 2];
        dd[i + 3] = 255;
    });
}

GFX.Dilate = function(dst, src, amt) {
    var sd = src.data,
        dd = dst.data,
        w = src.width,
        h = src.height;
    GFX.each(src, function(i, x, y) {
        dd[i + 0] = dd[i + 1] = dd[i + 2] = 0;
        dd[i + 3] = 255;
    });
    GFX.each(src, function(i, x, y) {
        if (sd[i + 0] > 0 || sd[i + 1] > 0 || sd[i + 2] > 0) {
            for (var dx = Math.max(0, x - amt); dx < Math.min(w, x + amt); dx++) {
                for (var dy = Math.max(0, y - amt); dy < Math.min(h, y + amt); dy++) {
                    var j = (dy * w + dx) * 4;
                    dd[j + 0] = dd[j + 1] = dd[j + 2] = 255;
                }
            }
        }
    });
}
GFX.Erode = function(dst, src, amt) {
    var sd = src.data,
        dd = dst.data,
        w = src.width,
        h = src.height;
    GFX.each(src, function(i, x, y) {
        dd[i + 0] = dd[i + 1] = dd[i + 2] = sd[i] ? 255 : 0;
        dd[i + 3] = 255;
    });
    GFX.each(src, function(i, x, y) {
        if (sd[i + 0] == 0 && sd[i + 1] == 0 && sd[i + 2] == 0) {
            for (var dx = Math.max(0, x - amt); dx < Math.min(w, x + amt); dx++) {
                for (var dy = Math.max(0, y - amt); dy < Math.min(h, y + amt); dy++) {
                    var j = (dy * w + dx) * 4;
                    dd[j + 0] = dd[j + 1] = dd[j + 2] = 0;
                }
            }
        }
    });
};
