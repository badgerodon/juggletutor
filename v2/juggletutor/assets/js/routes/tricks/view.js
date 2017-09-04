(function() {

var buildUrl = function(page, req, name, value) {
	var key = req.URL.Query.id.split('-');
	var rawQuery = req.URL.RawQuery;
	switch (name) {
	case "Style":
		key[1] = value;
		break;
	case "Count":
		key[2] = value;
		break;
	default:
		var query = _.extend({}, req.URL.Query);
		delete query["id"];
		query[name] = value;
		rawQuery = "?" + _.map(query, function(value, name) {
			return encodeURIComponent(name) + "=" + encodeURIComponent(value);
		}).join("&");
		break;
	}

	return '/families/' + key.join('-') + '/' + page + rawQuery;
};

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
	var options = [];
	_.each(family.Attributes, function(values, name) {
		options.push({
			"Name": name,
			"Values": _.map(values, function(value) {
				var url = buildUrl(page, req, name, value);
				return {
					"Name": value,
					"Link": url,
					"Selected": (req.URL.Path + req.URL.RawQuery) === url
				};
			})
		});
	});
	jt.Util.SortAttributes(options);
	var tabs = [
		{
			"Name": "Demonstrations",
			"Link": "/families/" + key + "/demonstrations" + req.URL.RawQuery,
			"Selected": page === "demonstrations"
		},
		{
			"Name": "Lessons",
			"Link": "/families/" + key + "/lessons" + req.URL.RawQuery,
			"Selected": page === "lessons"
		}
	];
	jt.Render("families/view", {
		Animation: "/assets/img/animations/" + family.Name + "-" + style + "-" + count + ".gif",
		Name: family.Name,
		Options: options,
		Tabs: tabs,
		Body: body,
		Style: style,
		Count: count
	});
};

var renderVideos = function(req, page) {
	var key = req.URL.Query.id;
	var family = key.split('-')[0];
	var style = key.split('-')[1];
	var count = key.split('-')[2];

	var attributes = {
		"Family": family,
		"Style": style,
		"Count": count
	};
	_.each(req.URL.Query, function(value, name) {
		if (name !== "id") {
			attributes[name] = value;
		}
	});

	jt.Api("GetVideos", {
		"Type": page == "demonstrations" ? "Demonstration" : "Lesson",
		"Status": "Approved",
		"Attributes": attributes,
		"Offset": 0,
		"Limit": 10
	}, function(res, err) {
		if (err) {
			jt.Render("500", { "error": err });
			return;
		}
		renderView(page, req, jt.RenderTemplate("families/videos", {
			"Videos": res.Videos,
			"Users": res.Users
		}));
	});
};

function singularize(equipment) {
	if (equipment.substr(equipment.length-1) == "s") {
		return equipment.substr(0, equipment.length-1);
	}
	return equipment;
}

jt.Route("/tricks/<Style>/<Equipment>/<Count>/<Trick>", function(req) {
	var q = req.URL.Query;
	jt.Api("GetVideos", {
		"Status": "Approved",
		"Attributes": {
			"Style": q.Style,
			"Equipment": q.Equipment,
			"Count": q.Count,
			"Trick": q.Trick
		},
		"Offset": 0,
		"Limit": 10
	}, function(res, err) {
		if (err) {
			jt.Render("500", { "error": err });
			return;
		}
		jt.Render("tricks/view", _.extend({
			"Title": q.Count + " " + singularize(q.Equipment) + " " + q.Trick,
			"Videos": res.Videos,
			"Users": res.Users
		}, q));
	});
});

})();
