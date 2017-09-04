#ifndef GFX_H
#define GFX_H

#include "math.h"
#include <vector>
#include <map>
#include <set>
using namespace std;

#include "disjoint_set.hpp"

struct Kernel
{
  double *Data;
  int Width;
  int Height;
};

struct Rect
{
  int x1;
  int y1;
  int x2;
  int y2;
};

struct Image
{
  uint8_t *Data;
  int Width;
  int Height;
};

void MaskGreenish(Image img);
void MaskSkin(Image img);
void Convolve(Image img, Kernel kernel);
void GaussianBlur(Image img, double diameter);
void HorizontalConvolve(Image img, vector<double> weights, bool opaque);
void VerticalConvolve(Image img, vector<double> weights, bool opaque);
int FindLargestBlobs(Image img, vector<Rect> &blobs);
int FindFaces(Image img, vector<Rect> &faces);
bool IsSkin(int r, int g, int b);
bool IsOpticYellow(long r, long g, long b);

double colorDistance(long r1, long g1, long b1, long r2, long g2, long b2);
void rgb2hsv(double *, double *);

#endif
