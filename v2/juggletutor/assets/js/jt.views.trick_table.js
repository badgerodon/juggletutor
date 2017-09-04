(function() {

var mkHeaderRow = function(name) {
	return {
		"name": name
	};
};
var mkRow = function(profile, name, key, depth) {
	var demonstration = profile.demonstrations[key] || {
		"status": 0,
		"rating": 0
	};
	return {
		"name": name,
		"depth": depth,
		"link": "/tricks/" + key,
		"status": demonstration.status,
		"rating": demonstration.rating,
		"total_accepted": Globals.trick_stats[key] || 0
	}
};
var optionPermutations = function(profile, array, prefix, options, depth) {
	if (options.length > 0) {
		var option = options[0];
		_.each(option.values, function(value) {
			var key = prefix + "-" + value;
			var name = _.str.titleize(value);
			var row = mkHeaderRow(name);
			if (options.length == 1) {
				row = mkRow(profile, name, key, depth);
			}
			array.push(row);
			optionPermutations(profile, array, key, options.slice(1), depth+1);
		});
	}
};
var trick_rows = [];

_.extend(jt.views, {
	trick_table: function(profile, equipment, count) {
		var values = ["balls", "clubs"];
		var tabs1 = _.map(values, function(v) {
			return {
				"args": [v, 3].join(","),
				"name": _.str.titleize(v),
				"selected": v === equipment
			};
		});
		var counts = ["2","3","4","5","6","7","8","9"];
		var tabs2 = _.map(counts, function(v) {
			return {
				"args": [equipment, v].join(","),
				"name": _.str.titleize(v),
				"selected": v === count
			};
		});
		var tricks = [];
		_.each(Globals.trick_families, function(family) {
			var additionalOptions = [];
			var hasEquipment = false;
			var hasCount = false;
			_.each(family.options, function(option) {
				if (option.key === "equipment") {
					hasEquipment = _.indexOf(option.values, equipment) >= 0;
				} else if (option.key === "count") {
					hasCount = _.indexOf(option.values, count) >= 0;
				} else {
					additionalOptions.push(option);
				}
			});
			if (hasEquipment && hasCount) {
				if (additionalOptions.length) {
					tricks.push(mkHeaderRow(family.names[0]));
					optionPermutations(
						profile,
						tricks,
						family.key + "-" + equipment + "-" + count,
						additionalOptions,
						1
					);
				} else {
					tricks.push(mkRow(profile, family.names[0], family.key + "-" + equipment + "-" + count, 0));
				}
			}
		});
		return jt.renderTemplate("shared/trick_table", {
			"tabs1": tabs1,
			"tabs2": tabs2,
			"tricks": tricks
		});
	}
});

$("body")
	.on("click", "#trick-table a", function(evt) {
		var args = $(this).closest("a").attr("data-args");
		if (!args) {
			return;
		}
		evt.preventDefault();
		$("#trick-table").replaceWith(
			jt.views.trick_table.apply(this, args.split(","))
		);
	});


})();

