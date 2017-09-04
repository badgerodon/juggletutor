QUnit.test("TestAVLTree", function(assert) {
  Math.seedrandom("test");

  var t = new AVLTree();
  assert.equal(t.Size(), 0, "size defaults to 0");
  t.Set("hello", "world");
  assert.equal(t.Size(), 1, "size works");
  assert.equal(t.Get("hello"), "world", "get works");

  t = new AVLTree();
  for (var i=0; i<1000; i++) {
      t.Set(Math.random(), i);
  }
  assert.equal(t.Size(), 1000);
  var iterator = t.GetIterator();
  var last = Number.NEGATIVE_INFINITY;
  while (iterator.Next()) {
    if (iterator.Key() < last) {
      assert.ok(iterator.Key() >= last);
    }
    last = iterator.Key();
  }
  assert.ok(t.root.Height < 20, "has log(N) performance");
});
