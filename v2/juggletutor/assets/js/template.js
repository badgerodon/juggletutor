(function() {

jt.Render = function(template, model) {
	model = model || {};

	if (!jt._loaded) {
		$("#page-header").fadeIn('fast').show();
		jt._loaded = true;
	}

	$("#page-body > .grid-container").html(jt.RenderTemplate(template, model));
	$("#page-body").show();
};

jt.RenderTemplate = function(template, model) {
	if (!Templates[template]) {
		console.error("Unknown template: " + template);
	}
	return Templates[template](model);
};

_.each(Templates, function(v, k) {
	Templates[k] = _.template(v);
});

_.addTemplateHelpers({
	"mkSelect": function(name, items, selected) {
		var html = [
			'<select name="', name, '">'
		];
		_.each(items, function(name, value) {
			html.push(
				'<option value="', value, '"', (value === selected ? ' selected="SELECTED"' : ''),'>',
					name,
				'</option>'
			);
		});
		html.push(
			'</select>'
		);
		return html.join("");
	}
})

})();

