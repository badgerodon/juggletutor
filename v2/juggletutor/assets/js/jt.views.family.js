(function() {

_.extend(jt.views, {
	family: {
		create: function() {
			jt.views.family.edit({});
		},
		edit: function(args) {
			jt.render("family/edit", {

			});

		}
	}
});

$("body")
	.on("click", "#family .create", function(evt) {
		evt.preventDefault();

		var obj = {
			"name": $("#family input[name=name]").val(),
			"family_option": []
		};

		$("#family .option").each(function() {
			var option = {
				"property_value": []
			};
			var property = $(this).find("input[name=property]").val();
			if (isNaN(+property)) {
				option.name = property;
			} else {
				option.property_id = +property;
			}

			var optionValues = {};
			$(this).find("select.property-value option").each(function() {
				optionValues[$(this).val()] = $(this).html();
			});

			_.each($(this).find("select.property-value").val(), function(v) {
				if (optionValues[v] === v) {
					option.property_value.push({
						"name": v
					});
				} else {
					option.property_value.push({
						"property_value_id": +v
					});
				}
			}, this);

			obj.family_option.push(option);
		});

		jt.api("create_family", {
			"data": JSON.stringify(obj),
			"success": function(family_id) {
				jt.navigate("/family/" + family_id);
			}
		});
	})
	.on("click", "#family .remove-option", function(evt) {
		evt.preventDefault();

		$(this).closest(".option").remove();
	})
	.on("click", "#family .add-option", function(evt) {
		evt.preventDefault();

		var $select = $("<select class='property'></select>");
		$select.append("<option></option>");
		jt.db.wrap(jt.globals.property).each(function(property) {
			$select.append(
				$("<option></option>")
					.val(property.property_id)
					.text(property.name)
			);
		});

		$(this).before(
			$("<div class='option'></div>")
				.append($select)
				.append(' ')
				.append("<a href='#' class='remove-option'><i class='icon-remove'></i></a>")
		);

		$select.chosen({
	    create_option: true,
	    persistent_create_option: true
		});
		$select.change(function() {
			var $input = $("<input type='hidden' name='property'>");
			$input.val($select.val());
			$select.before($input);
			$select.before($("<span class='property'></span>").append($select.find("option[value=" + $select.val() + "]").html()));
			$select.before(" ");

			var $newSelect = $("<select class='property-value' multiple></select>");
			jt.db.wrap(jt.globals.property_value).each(function(value) {
				if (value.property_id === +$select.val()) {
					$newSelect.append(
						$("<option></option")
							.val(value.property_value_id)
							.text(value.name)
					);
				}
			});

			$select.before($newSelect);
			$newSelect.chosen({
		    create_option: true,
		    persistent_create_option: true
			});

			$select.next().remove();
			$select.remove();
		});
	});

})();
