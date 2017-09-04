(function() {


$("body")
	.on("click", ".new-lesson", function(evt) {
		evt.preventDefault();

		var family = $(this).closest("[data-family]").attr("data-family") || null;
		var style = $(this).closest("[data-style]").attr("data-style") || null;
		var count = $(this).closest("[data-count]").attr("data-count") || null;

		var url = "/lessons/new?";
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
	.on("click", ".edit-lesson", function(evt) {
		evt.preventDefault();
	})

})();
