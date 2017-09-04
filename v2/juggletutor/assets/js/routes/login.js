jt.Route("/login", function(req) {
  var url = "https://accounts.google.com/o/oauth2/auth?" + [
    "response_type=token",
    "client_id=" + Settings.GoogleClientId,
    "redirect_uri=" + encodeURIComponent(Settings.GoogleRedirectUri),
    "scope=" + [
      "https://gdata.youtube.com",
      "https://www.googleapis.com/auth/userinfo.profile"
    ].join('%20')
  ].join('&');
  location.href = url;
});