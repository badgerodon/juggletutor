(function() {

function renderSelect(name, values, selected) {
	var html = [
		'<select name="', name, '">',
			'<option value="">Choose a Value</option>'
	];

	_.each(values, function(value) {
		html.push(
			'<option ',
				'value="', value, '" ',
				(value === selected ? 'selected="SELECTED" ' : ''),
			'>', 
				value, 
			'</option>'
		);
	});

	html.push(
			'<option value="_">Other...</option>',
		'</select> ',
		'<span class="new-value" style="display:none;">',
			'<input type="text" name="New', name, '" value="" placeholder="Enter a New Value">',
		'</span>'
	);

	return html.join("");
}

function getValueLookup(attributes, selected) {
	var hash = {};

	_.each(attributes.Values, function(vs) {
		hash[vs[0]] = {};
	});
	_.each(attributes.Sets, function(set) {
		var include = true;
		_.each(set, function(idx, i) {
			if (idx > 0) {
				var name = attributes.Values[i][0];
				var value = attributes.Values[i][idx];
				include = include && (!selected[name] || selected[name] === value);
			}
		})
		if (!include) {
			return;
		}
		_.each(set, function(idx, i) {
			if (idx > 0) {
				var name = attributes.Values[i][0];
				var value = attributes.Values[i][idx];
				hash[name][value] = hash[name][value] || 
					!selected[name] || 
					selected[name] === value;
			}
		});
	})
	return hash;
}

function render(attributes, selected) {
	jt.Render("videos/new", {
		"Attributes": _.map(attributes.Values, function(vs) {
			return {
				"name": vs[0],
				"html": renderSelect(vs[0], vs.slice(1), selected[vs[0]])
			};
		})
	});
	var onchange = function() {
		var chosen = {};
		$("#videos-new .attributes select").each(function() {
			var $select = $(this);
			if ($select.val() === "_") {
				$select.parent().find(".new-value").show();
			} else {
				$select.parent().find(".new-value").hide();
			}
			var name = $select.attr("name");
			var lookup = getValueLookup(attributes, chosen);
			$select.find("option").each(function() {
				var $option = $(this);
				var value = $option.val();
				if (value === "_" || value === "" || lookup[name][value]) {
					$option.show();
				} else {
					$option.hide();
					if (value === $select.val()) {
						$select.val("");
					}
				}
			});

			chosen[name] = $select.val();
		});
	};
	$("#videos-new .attributes select").change(onchange);
	onchange();
}

// New
jt.Route("/videos/new", function(req) {
	jt.Api("GetAttributes", {}, function(attributes) {
		render(attributes, req.URL.Query)
	});
});

// events
$("body")
	.on("click", ".new-demonstration", function(evt) {
		evt.preventDefault();

		var family = $(this).closest("[data-Family]").attr("data-Family") || null;
		var style = $(this).closest("[data-Style]").attr("data-Style") || null;
		var count = $(this).closest("[data-Count]").attr("data-Count") || null;

		var url = "/videos/new?Type=" + "Demonstration";
		if (family) {
			url += "&Family=" + encodeURIComponent(family);
		}
		if (style) {
			url += "&Style=" + encodeURIComponent(style);
		}
		if (count) {
			url += "&Count=" + encodeURIComponent(count);
		}
		jt.Navigate(url);
	})
	.on("click", ".new-lesson", function(evt) {
		evt.preventDefault();

		var family = $(this).closest("[data-Family]").attr("data-Family") || null;
		var style = $(this).closest("[data-Style]").attr("data-Style") || null;
		var count = $(this).closest("[data-Count]").attr("data-Count") || null;

		var url = "/videos/new?Type=" + "Lesson";
		if (family) {
			url += "&Family=" + encodeURIComponent(family);
		}
		if (style) {
			url += "&Style=" + encodeURIComponent(style);
		}
		if (count) {
			url += "&Count=" + encodeURIComponent(count);
		}
		jt.Navigate(url);
	})
	.on("click", "#videos-new .cancel", function(evt) {
		evt.preventDefault();

		history.back();
	})
	.on("click", "#videos-new .submit", function(evt) {
		evt.preventDefault();
		var $btn = $(this);
		if ($btn.hasClass("disabled")) {
			return
		}

		var attributes = {};
		$("#videos-new select[name], #videos-new input[name]").each(function() {
			var n = $(this).attr("name");
			var v = $(this).val();
			if (n.substr(0, 3) === "New") {
				if (v) {
					attributes[n.substr(3)] = v;
				}
			} else {
				attributes[n] = v;
			}
		});

		var videoId = attributes.VideoId;
		delete attributes.VideoId;
		var start = attributes.Start;
		delete attributes.Start;
		var end = attributes.End;
		delete attributes.End;
		var type = attributes.Type;
		delete attributes.Type;

		if (!videoId) {
			alert("A Video ID is required");
			return;
		}

		$btn.addClass("disabled");

		jt.Api("SubmitVideo", {
			"Type": type,
			"VideoId": videoId,
			"Start": start,
			"End": end,
			"Attributes": attributes
		}, function(res, err) {
			$btn.removeClass("disabled");
			if (err) {
				alert(err);
				return;
			}
			alert("Your video has been submitted and is currently under review");
			history.back();
		});
	});

})();
