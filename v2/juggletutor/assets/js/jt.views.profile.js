_.extend(jt.views, {
	profile: function(args, profile) {
		var data = _.extend({}, profile);
		data.name = data.name || "";
		data.picture = data.picture || '/assets/img/no-avatar.png';
		data.trick_table = jt.views.trick_table(profile, "balls", "3");
		jt.render("profile/view", data);
	}
});
