(function() {

var routes = {
	"404": function() {
		jt.Render("404", {});
	}
};
var routeTable;

jt.OnChangeUrl = function(value) {
	var url = jt.ParseUrl(value);

	// Update the tabs
	$("#page-nav").attr("class", jt.Session["User.Id"] ? "logged-in" : "logged-out");
	var urls = [];
	$("#page-nav a").removeClass("selected").each(function() {
		urls.push($(this).attr("href"));
	});
	urls.sort(function(a,b) {
		return a.length > b.length ? -1 : a.length < b.length ? 1 : 0;
	});
	for (var i=0; i<urls.length; i++) {
		if (url.Path === urls[i] || (urls[i] !== "/" && value.indexOf(urls[i]) === 0)) {
			$("#page-nav a[href='" + urls[i] + "']").addClass("selected");
			break;
		}
	}

	var route = findRoute(url.Path, url.Query);

	$("#page-body").hide();
	route({
		"URL": url
	});
};

var findRoute = function(path, args) {
	if (!routeTable) {
		routeTable = [];
		_.each(routes, function(v, k) {
			routeTable.push(k);
		});
		routeTable.sort(function(a,b) {
			return a > b ? -1 : b > a ? 1 : 0;
		});
		routeTable = _.map(routeTable, function(route) {
			var keys = [];
			var regex = route.replace(/\<([^>]+)\>/g, function(__, key) {
				keys.push(key);
				return "([^/]+)";
			});
			return {
				"regex": new RegExp("^" + regex + "$"),
				"keys": keys,
				"route": routes[route]
			};
		});
	}

	var route = _.find(routeTable, function(route) {
		var match = route.regex.exec(path);
		if (match) {
			for (var i=1; i<match.length; i++) {
				args[route.keys[i-1]] = match[i];
			}
			return true;
		}
		return false;
	});
	if (route) {
		return route.route;
	}
	return routes['404'];
};

// Go to the given url
jt.Navigate = function(url, saveState) {
	if (saveState === undefined) {
		saveState = true;
	}
	if (saveState) {
		history.pushState(null, null, url);
	} else {
		history.replaceState(null, null, url);
	}
	jt.OnChangeUrl(url);
};

// Transform a string into a URL object
jt.ParseUrl = function(url) {
	var obj = {
		'Scheme': 'http',
		'User': null,
		'Host': '',
		'Path': '',
		'RawQuery': '',
		'Fragment': '',
		'Query': {}
	};
	if (!url) {
		return obj;
	}
	var hp = url.indexOf('#');
	if (hp >= 0) {
		obj.Fragment = url.substr(hp + 1);
		url = url.substr(0, hp);
	}

	var qp = url.indexOf('?');
	if (qp >= 0) {
		var q = url.substr(qp + 1);
		obj.RawQuery = q;
		_.each(q.split('&'), function(kvp) {
			var p = kvp.indexOf('='), k, v;
			if (p >= 0) {
				k = decodeURIComponent(kvp.substr(0, p).replace(/\+/g,'%20'));
				v = decodeURIComponent(kvp.substr(p+1).replace(/\+/g,'%20'));
			} else {
				k = decodeURIComponent(kvp);
				v = 'on';
			}
			obj.Query[k] = v;
		});
		url = url.substr(0, qp);
	}

	obj.Path = url;

	return obj;
};

// Create a handler mapped to the given route
jt.Route = function(path, handler) {
	routes[path] = handler;
};

jt.InitRouting = function() {
	var getUrl = function() {
		var loc = history.location || document.location;
		return loc.pathname + loc.search + loc.hash
	};

	var firstUrl = getUrl();

	window.onpopstate = _.bind(function(evt) {
		var url = getUrl();
		if (url === firstUrl) {
			firstUrl = null;
			return;
		}
		firstUrl = null;
		jt.OnChangeUrl(url);
	}, this);

	jt.OnChangeUrl(firstUrl);
}

$(document).on("click", "a[href^='/']", function(event) {
  if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
    event.preventDefault();
    jt.Navigate($(this).attr("href"));
  }
});

})();
