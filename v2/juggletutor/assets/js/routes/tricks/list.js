(function() {

// Styles [Toss Juggling / Contact Juggling]
// Equipment [Balls / Clubs]
//  - Trick (Count ...)

var sIdx, eIdx, cIdx, tIdx;

function fillIndices(attributes) {
	_.each(attributes.Values, function(vs, i) {
		switch (vs[0]) {
		case "Style":
			sIdx = i;
			break;
		case "Equipment":
			eIdx = i;
			break;
		case "Count":
			cIdx = i;
			break;
		case "Trick":
			tIdx = i;
			break;
		}
	});
}

function fillSelected(attributes, selected) {
	if (!selected.Style) {
		selected.Style = attributes.Values[sIdx][1];
	}
	if (!selected.Equipment) {
		for (var i=0; i<attributes.Sets.length; i++) {
			var set = attributes.Sets[i];
			var e = attributes.Values[eIdx][set[eIdx]];
			var s = attributes.Values[sIdx][set[sIdx]];
			if (s === selected.Style) {
				selected.Equipment = e;
				break;
			}
		}
	}
}

function getStyles(attributes, selected) {
	return _.map(attributes.Values[sIdx].slice(1), function(v) {
		return {
			"Name": v,
			"Link": "/tricks" +
				"?Style=" + encodeURIComponent(v),
			"Selected": v === selected.Style
		};
	});
}

function getEquipment(attributes, selected) {
	var lookup = {};
	_.each(attributes.Sets, function(set) {
		var e = attributes.Values[eIdx][set[eIdx]];
		var s = attributes.Values[sIdx][set[sIdx]];
		lookup[e] = s === selected.Style;
	});
	var vs = _.filter(attributes.Values[eIdx], function(v) {
		return lookup[v];
	});
	return _.map(vs, function(v) {
		return {
			"Name": v,
			"Link": "/tricks" + 
				"?Style=" + encodeURIComponent(selected.Style) + 
				"&Equipment=" + encodeURIComponent(v),
			"Selected": v === selected.Equipment
		}
	});
}

function getTricks(attributes, selected) {
	var tricks = {};
	var lookup = {};
	_.each(attributes.Sets, function(set) {
		var s = attributes.Values[sIdx][set[sIdx]];
		var e = attributes.Values[eIdx][set[eIdx]];
		var c = attributes.Values[cIdx][set[cIdx]];
		var t = attributes.Values[tIdx][set[tIdx]];
		if (s === selected.Style && e === selected.Equipment) {
			if (!lookup[c]) {
				lookup[c] = {};
			}
			lookup[c][t] = true;
		}
	});
	_.each(attributes.Values[cIdx].slice(1), function(v) {
		if (lookup[v]) {
			tricks[v + " " + selected.Equipment] = [];
			_.each(attributes.Values[tIdx].slice(1), function(tv) {
				if (lookup[v][tv]) {
					tricks[v + " " + selected.Equipment].push({
						"Name": tv,
						"Link": "/tricks" +
							"/" + encodeURIComponent(selected.Style) +
							"/" + encodeURIComponent(selected.Equipment) +
							"/" + encodeURIComponent(v) +
							"/" + encodeURIComponent(tv)
					});
				}
			})
		}
	});

	return tricks;
}

function render(attributes, selected) {
	fillIndices(attributes);
	fillSelected(attributes, selected);

	var styles = getStyles(attributes, selected);
	var equipment = getEquipment(attributes, selected);
	var tricks = getTricks(attributes, selected);

	jt.Render("tricks/list", {
		"Styles": styles,
		"Equipment": equipment,
		"Tricks": tricks
	});
}

jt.Route("/tricks", function(req) {
	jt.Api("GetAttributes", {}, function(attributes) {
		render(attributes, req.URL.Query);
	});
});

jt.Route("/tricks/<Style>", function(req) {
	jt.Api("GetAttributes", {}, function(attributes) {
		render(attributes, req.URL.Query);
	});
});

jt.Route("/tricks/<Style>/<Equipment>", function(req) {
	jt.Api("GetAttributes", {}, function(attributes) {
		render(attributes, req.URL.Query);
	});
});

})();
