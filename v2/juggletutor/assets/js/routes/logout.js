jt.Route("/logout", function(req) {
  amplify.store("Session", null);
  amplify.store("SessionKey", null);
  jt.Session = {};
  jt.Navigate("/");
});