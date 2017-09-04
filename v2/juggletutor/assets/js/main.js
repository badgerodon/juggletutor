$(function() {
  jt.Api("GetGlobals", {}, function(globals, err) {
    if (err) {
      console.warn(err);
      return;
    }
    jt.Globals = globals;
    jt.InitRouting();
  });
});