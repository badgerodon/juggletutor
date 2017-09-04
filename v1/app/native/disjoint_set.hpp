#ifndef DISJOINT_SET_H
#define DISJOINT_SET_H

#include <vector>
#include <iostream>
using namespace std;

class DisjointSet {
public:
  DisjointSet(int n);
  int Union(int s1, int s2);
  int Find(int element);
protected:
  vector<int> links;
  vector<int> ranks;
};

#endif
