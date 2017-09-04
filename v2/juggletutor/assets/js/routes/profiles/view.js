(function() {

function getAchievements(videos) {
  var byStyle = {};
  _.each(videos, function(video) {
    var style = video.Attributes.Style;
    var equipment = video.Attributes.Equipment;
    var count = video.Attributes.Count;
    var trick = video.Attributes.Trick;

    var section = count + " " + equipment;
    var key = trick + "|" + video.Type;
    if (!byStyle[style]) {
      byStyle[style] = {};
    }
    if (!byStyle[style][section]) {
      byStyle[style][section] = {};
    }
    if (!byStyle[style][section][key]) {
      byStyle[style][section][key] = {
        "Name": trick,
        "Link": "/videos/" + video.Id
      };
    }
    byStyle[style][section][key][video.Type] = video.Id;
  });
  return byStyle;
}


jt.Route("/profiles", function(req) {
	if (jt.Session["User.Id"]) {
		jt.Navigate("/profiles/" + jt.Session["User.Id"], false);
		return;
	}
	jt.Navigate("/", false);
});

jt.Route("/profiles/<Id>", function(req) {
  jt.Api("GetProfile", {
    "Id": +req.URL.Query.Id
  }, function(profile, err) {
  	if (err) {
  		jt.Navigate("500", {
        "error": err
      });
  		return;
  	}
    jt.Render("profiles/view", {
      "User": profile.User,
      "Achievements": getAchievements(profile.Videos)
    });
  });
});

})();