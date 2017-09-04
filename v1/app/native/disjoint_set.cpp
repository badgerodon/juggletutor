#include "disjoint_set.hpp"

DisjointSet::DisjointSet(int n) {
  links.resize(n, -1);
  ranks.resize(n, 1);
}

int DisjointSet::Find(int element) {
  vector<int> q;
  int i;
  while (links[element] != -1) {
    q.push_back(element);
    element = links[element];
  }
  for (int i=0; i<q.size(); i++) {
    links[q[i]] = element;
  }
  return element;
}

int DisjointSet::Union(int s1, int s2) {
  if (s1 == s2) {
    return s1;
  }
  int p, c;
  if (ranks[s1] > ranks[s2]) {
    p = s1;
    c = s2;
  } else {
    p = s2;
    c = s1;
  }
  links[c] = p;
  ranks[p] += ranks[c];
  return p;
}
