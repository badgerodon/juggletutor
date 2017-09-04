(function() {
function render(selected) {
	var attributes = [];
	attributes.push({
		"Name": "Family",
		"Options": _.map(jt.Globals.Families, function(family) {
			return {
				"Name": family.Name,
				"Selected": selected.Family === family.Name
			};
		})
	});
	if (selected.Family) {
		_.each(jt.Globals.Families[selected.Family].Attributes, function(values, attribute) {
			attributes.push({
				"Name": attribute,
				"Options": _.map(values, function(value) {
					return {
						"Name": value,
						"Selected": value === selected[attribute]
					};
				})
			})
		});
	}
	jt.Render("demonstrations/new", {
		"Attributes": attributes
	});

	$("#demonstration-new select").change(function() {
		// For the family we just re-render
		if ($(this).attr("name") === "Family") {
			render({
				"Family": $(this).val()
			});
			return;
		}
		var allSet = true;
		$("#demonstration-new select").each(function() {
			selected[$(this).attr("name")] = $(this).val();
			allSet = allSet && $(this).val();
		});
		if (allSet) {
			$("#widget").show();
		} else {
			$("#widget").hide();
		}
	});

	jt.Youtube.Widget({
		"type": "Demonstration",
		"attributes": function() {
			return selected;
		},
		"complete": function(videoId) {
			$("#demonstration-new").attr("data-id", videoId);
		}
	})
}

// New
jt.Route("/demonstrations/new", function(req) {
	render(req.URL.Query);
});

// events
$("body")
	.on("click", ".new-demonstration", function(evt) {
		evt.preventDefault();

		var family = $(this).closest("[data-Family]").attr("data-Family") || null;
		var style = $(this).closest("[data-Style]").attr("data-Style") || null;
		var count = $(this).closest("[data-Count]").attr("data-Count") || null;

		var url = "/demonstrations/new?";
		if (family) {
			url += "Family=" + encodeURIComponent(family);
		}
		if (style) {
			url += "&Style=" + encodeURIComponent(style);
		}
		if (count) {
			url += "&Count=" + encodeURIComponent(count);
		}
		jt.Navigate(url);
	})
	.on("click", "#demonstration-new .cancel", function(evt) {
		evt.preventDefault();

		history.back();
	})
	.on("click", "#demonstration-new .delete", function(evt) {
		evt.preventDefault();
	})
	.on("click", "#demonstration-new .save", function(evt) {
		evt.preventDefault();

	});

})();
