(function() {

jt.Route("/families", function() {
	var styleMap = {};
	_.each(jt.Globals.Families, function(family) {
		var styles = family.Attributes["Style"];
		var counts = family.Attributes["Count"];
		_.each(styles, function(style) {
			styleMap[style] = styleMap[style] || [];
			styleMap[style].push(_.extend(family, {
				"Counts": counts
			}));
		});
	});

	var styles = _.map(styleMap, function(families, style) {
		return {
			"Name": style,
			"Families": families
		}
	});
	console.log(styles);
	jt.Render("families/list", {
		"Styles": styles
	});

});

})();
