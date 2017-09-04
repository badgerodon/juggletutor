#include "gfx.hpp"

struct compareRectangle
{
  bool operator()(const Rect &a, const Rect &b)
  {
    int asz = (a.x2 - a.x1) * (a.y2 - a.y1);
    int bsz = (b.x2 - b.x1) * (b.y2 - b.y1);
    if (asz == bsz)
    {
      if (a.x1 == b.x1)
      {
        return a.y1 < b.y1;
      }
      else
      {
        return a.x1 < b.x1;
      }
    }
    else
    {
      return asz < bsz;
    }
  }
};

void MaskGreenish(Image img)
{
  for (int32_t x = 0; x < img.Width; x++)
  {
    for (int32_t y = 0; y < img.Height; y++)
    {
      int32_t o = (y * img.Width + x) * 4;

      uint8_t r = img.Data[o + 0];
      uint8_t g = img.Data[o + 1];
      uint8_t b = img.Data[o + 2];
      uint8_t a = img.Data[o + 3];

      if (IsOpticYellow(r, g, b))
      {
        img.Data[o + 0] = img.Data[o + 1] = img.Data[o + 2] = 0xFF;
      }
      else
      {
        img.Data[o + 0] = img.Data[o + 1] = img.Data[o + 2] = 0x00;
      }
    }
  }
}

void MaskSkin(Image img)
{
  for (int32_t x = 0; x < img.Width; x++)
  {
    for (int32_t y = 0; y < img.Height; y++)
    {
      int32_t o = (y * img.Width + x) * 4;

      uint8_t r = img.Data[o + 0];
      uint8_t g = img.Data[o + 1];
      uint8_t b = img.Data[o + 2];
      uint8_t a = img.Data[o + 3];

      if (IsSkin(r, g, b))
      {
        img.Data[o + 0] = img.Data[o + 1] = img.Data[o + 2] = 0xFF;
      }
      else
      {
        img.Data[o + 0] = img.Data[o + 1] = img.Data[o + 2] = 0x00;
      }
    }
  }
}

void GaussianBlur(Image img, double diameter)
{
  if (diameter <= 1)
  {
    return;
  }
  double radius = diameter / 2;
  int len = int(ceil(diameter)) + (1 - int(ceil(diameter)) % 2);
  vector<double> weights(len);
  double rho = (radius + 0.5) / 3;
  double rhoSq = rho * rho;
  double gaussianFactor = 1.0 / sqrt(2 * M_PI * rhoSq);
  double rhoFactor = -1.0 / (2.0 * rhoSq);
  double wsum = 0;
  int middle = len / 2;
  for (int i = 0; i < len; i++)
  {
    double x = i - middle;
    double gx = gaussianFactor * exp(x * x * rhoFactor);
    weights[i] = gx;
    wsum += gx;
  }
  for (int i = 0; i < len; i++)
  {
    weights[i] /= wsum;
  }
  VerticalConvolve(img, weights, true);
  HorizontalConvolve(img, weights, true);
}

void HorizontalConvolve(Image img, vector<double> weights, bool opaque)
{
  int side = weights.size();
  int halfSide = side / 2;
  int w = img.Width;
  int h = img.Height;
  double r, g, b, a;

  for (int y = 0; y < h; y++)
  {
    for (int x = 0; x < w; x++)
    {
      r = g = b = a = 0;
      int o = (y * w + x) * 4;
      for (int i = 0; i < side; i++)
      {
        int ix = min(w - 1, max(0, x + i - halfSide));
        int iy = y;
        int io = (iy * w + ix) * 4;
        r += img.Data[io + 0] * weights[i];
        g += img.Data[io + 1] * weights[i];
        b += img.Data[io + 2] * weights[i];
        a += img.Data[io + 3] * weights[i];
      }
      img.Data[o + 0] = r;
      img.Data[o + 1] = g;
      img.Data[o + 2] = b;
      if (!opaque)
      {
        img.Data[o + 3] = a;
      }
    }
  }
}
void VerticalConvolve(Image img, vector<double> weights, bool opaque)
{
  int side = weights.size();
  int halfSide = side / 2;
  int w = img.Width;
  int h = img.Height;
  double r, g, b, a;

  for (int y = 0; y < h; y++)
  {
    for (int x = 0; x < w; x++)
    {
      r = g = b = a = 0;
      int o = (y * w + x) * 4;
      for (int i = 0; i < side; i++)
      {
        int ix = x;
        int iy = min(h - 1, max(0, y + i - halfSide));
        int io = (iy * w + ix) * 4;
        r += img.Data[io + 0] * weights[i];
        g += img.Data[io + 1] * weights[i];
        b += img.Data[io + 2] * weights[i];
        a += img.Data[io + 3] * weights[i];
      }
      img.Data[o + 0] = r;
      img.Data[o + 1] = g;
      img.Data[o + 2] = b;
      if (!opaque)
      {
        img.Data[o + 3] = a;
      }
    }
  }
}

void Convolve(Image img, Kernel kernel)
{
  double sr, sg, sb;

  for (int x = 0; x < img.Width; x++)
  {
    for (int y = 0; y < img.Height; y++)
    {
      sr = sg = sb = 0;
      for (int kx = 0; kx < kernel.Width; kx++)
      {
        for (int ky = 0; ky < kernel.Height; ky++)
        {
          int ix = x - kx - 1;
          int iy = x - ky - 1;
          if (!(ix > 0 && ix < img.Width && iy > 0 && iy < img.Height))
          {
            ix = x;
            iy = y;
          }
          int io = (iy * img.Width + ix) * 4;
          int ko = ky * kernel.Width + kx;
          sr += kernel.Data[ko] * double(img.Data[io + 0]);
          sg += kernel.Data[ko] * double(img.Data[io + 1]);
          sb += kernel.Data[ko] * double(img.Data[io + 2]);
        }
      }
      int o = (y * img.Width + x) * 4;
      img.Data[o + 0] = uint8_t(sr);
      img.Data[o + 1] = uint8_t(sg);
      img.Data[o + 2] = uint8_t(sb);
    }
  }
}

int FindFaces(Image img, vector<Rect> &faces)
{
  return FindLargestBlobs(img, faces);
}

int FindLargestBlobs(Image img, vector<Rect> &blobs)
{
  int w = img.Width;
  int h = img.Height;

  DisjointSet dsset(w * h);
  // first pass
  for (int x = 0; x < w; x++)
  {
    for (int y = 0; y < h; y++)
    {
      int o = y * w + x;
      int ol = dsset.Find(o);
      if ((x - 1) >= 0)
      {
        int l = y * w + (x - 1);
        if (img.Data[o * 4] == img.Data[l * 4])
        {
          int ll = dsset.Find(l);
          dsset.Union(ol, ll);
        }
      }
      if ((x + 1) < w)
      {
        int r = y * w + (x + 1);
        if (img.Data[o * 4] == img.Data[r * 4])
        {
          int rl = dsset.Find(r);
          dsset.Union(ol, rl);
        }
      }
      if ((y - 1) >= 0)
      {
        int t = (y - 1) * w + x;
        if (img.Data[o * 4] == img.Data[t * 4])
        {
          int tl = dsset.Find(t);
          dsset.Union(ol, tl);
        }
      }
      if ((y + 1) < h)
      {
        int b = (y + 1) * w + x;
        if (img.Data[o * 4] == img.Data[b * 4])
        {
          int bl = dsset.Find(b);
          dsset.Union(ol, bl);
        }
      }
    }
  }
  map<int, Rect> rectangles;

  // 2nd pass
  for (int x = 0; x < w; x++)
  {
    for (int y = 0; y < h; y++)
    {
      int o = y * w + x;
      if (img.Data[o * 4] > 0)
      {
        int lbl = dsset.Find(o);
        if (rectangles.count(lbl) == 0)
        {
          Rect r = {x, y, x, y};
          rectangles[lbl] = r;
        }
        else
        {
          Rect r = rectangles[lbl];
          if (x < r.x1)
          {
            r.x1 = x;
          }
          if (x > r.x2)
          {
            r.x2 = x;
          }
          if (y < r.y1)
          {
            r.y1 = y;
          }
          if (y > r.y2)
          {
            r.y2 = y;
          }
          rectangles[lbl] = r;
        }
      }
    }
  }
  set<Rect, compareRectangle> all_rectangles;
  for (map<int, Rect>::iterator it = rectangles.begin(); it != rectangles.end(); ++it)
  {
    all_rectangles.insert(it->second);
  }
  set<Rect, compareRectangle>::reverse_iterator it = all_rectangles.rbegin();
  int count = 0;
  for (int i = 0; i < blobs.size() && it != all_rectangles.rend(); ++i, ++it)
  {
    blobs[i] = *it;
    count++;
  }
  return count;
}

bool IsSkin(int r, int g, int b)
{
  int mx = std::max(r, std::max(g, b));
  int mn = std::min(r, std::min(g, b));

  double rgb[3];
  rgb[0] = double(r) / 255;
  rgb[1] = double(g) / 255;
  rgb[2] = double(b) / 255;
  double hsv[3];
  rgb2hsv(rgb, hsv);

  return (
      hsv[0] > 0 && hsv[0] < 35 && hsv[1] > 0.23 && hsv[1] < 0.68);

  // var rgbClassifier = ((r > 95)
  // && (g > 40 && g < 100)
  // && (b > 20) && (
  //  (Math.max(r, g, b) - Math.min(r, g, b)) > 15) && (Math.abs(r - g) > 15) && (r > g)
  // && (r > b));

  // var normRgbClassifier = (((nr / ng) > 1.185) && (((r * b) / (Math.pow(r + g + b, 2))) > 0.107) && (((r * g) / (Math.pow(r + g + b, 2))) > 0.112));
  //var hsvClassifier = (h > 0 && h < 35 && s > 0.23 && s < 0.68);
}

bool IsOpticYellow(long r, long g, long b)
{
  return (g > (r + 10)) && (g > (b + 50)) && (g > 150);
}

// from https://www.compuphase.com/cmetric.htm
double colorDistance(long r1, long g1, long b1, long r2, long g2, long b2)
{
  long rmean = (r1 + r2) / 2;
  long r = r1 - r2;
  long g = g1 - g2;
  long b = b1 - b2;
  return sqrt((((512 + rmean) * r * r) >> 8) + 4 * g * g + (((767 - rmean) * b * b) >> 8));
}

void rgb2hsv(double *rgb, double *hsv)
{
  double r = rgb[0];
  double g = rgb[1];
  double b = rgb[2];

  double min, max, delta, h, s, v;

  min = r < g ? r : g;
  min = min < b ? min : b;

  max = r > g ? r : g;
  max = max > b ? max : b;

  v = max; // v
  delta = max - min;
  if (max > 0.0)
  {                    // NOTE: if Max is == 0, this divide would cause a crash
    s = (delta / max); // s

    if (r >= max)          // > is bogus, just keeps compilor happy
      h = (g - b) / delta; // between yellow & magenta
    else if (g >= max)
      h = 2.0 + (b - r) / delta; // between cyan & yellow
    else
      h = 4.0 + (r - g) / delta; // between magenta & cyan

    h *= 60.0; // degrees

    if (h < 0.0)
    {
      h += 360.0;
    }
  }
  else
  {
    s = 0.0;
    h = NAN;
  }

  hsv[0] = h;
  hsv[1] = s;
  hsv[2] = v;
}
