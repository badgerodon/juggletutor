jt.Route("/admin", function(req) {
	if (jt.Session["User.Type"] != "Admin") {
		jt.Render("403", {});
		return;
	}

	jt.Render("admin/index", {});
});
