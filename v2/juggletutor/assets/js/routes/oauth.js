jt.Route("/oauth2callback", function(req) {
  var hash = req.URL.Fragment;

  if (hash && hash.indexOf('access_token=') >= 0) {
    hash = jt.ParseUrl("?" + hash).Query;

    jt.Api("Login", {
      "AccessToken": hash.access_token
    }, function(result, error) {
      if (error != null) {
        console.warn(error);
        jt.Navigate("/");
        return;
      }
      jt.Navigate("/");
    });
  }
});
