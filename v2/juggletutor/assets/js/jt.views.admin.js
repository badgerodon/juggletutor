(function() {

_.extend(jt.views, {
	admin: {
		review: function(submissions) {
			jt.render("admin/review", {
				submissions: submissions
			});
		}
	}
});

// events
$("body")
	.on("click", "#admin-review .approve", function(evt) {
		evt.preventDefault();

		var $submission = $(this).closest(".submission");
		var id = $submission.attr("data-id");
		jt.api("approveSubmission", {
			"id": id,
			"success": function() {
				$submission.remove();
			}
		})
	})
	.on("click", "#admin-review .reject", function(evt) {
		evt.preventDefault();

	});


})();
