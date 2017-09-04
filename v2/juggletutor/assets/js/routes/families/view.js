(function() {

var renderView = function(page, req, body) {
	var key = req.URL.Query.id;
	var family = key.split('-')[0];
	var style = key.split('-')[1];
	var count = key.split('-')[2];
	if (!jt.Globals.Families[family]) {
		jt.Render("404", {});
		return;
	}
	var family = jt.Globals.Families[family];
	var tabs = [
		{
			"Name": "Demonstrations",
			"Link": "/families/" + key + "/demonstrations?" + req.URL.RawQuery,
			"Selected": page === "demonstrations"
		},
		{
			"Name": "Lessons",
			"Link": "/families/" + key + "/lessons?" + req.URL.RawQuery,
			"Selected": page === "lessons"
		}
	];
	jt.Render("families/view", {
		Name: family.Name,
		Options: [],
		Tabs: tabs,
		Body: body,
		Style: style,
		Count: count
	});
};

jt.Route("/families/<id>", function(req) {
	jt.Navigate("/families/" + req.URL.Query.id + "/demonstrations?" + req.URL.RawQuery, false);
});
jt.Route("/families/<id>/demonstrations", function(req) {
	renderView("demonstrations", req, jt.RenderTemplate("families/demonstrations", {

	}));
});
jt.Route("/families/<id>/lessons", function(req) {
	renderView("lessons", req, "LESSONS");
});
jt.Route("/families/<id>/submit", function(req) {
	renderView("submit", req, "SUBMIT");
});

})();
