jt.Route("/admin/users", function(req) {
	if (jt.Session["User.Type"] != "Admin") {
		jt.Render("403", {});
		return;
	}
  jt.Api("GetUsers", {
  	Limit: 10,
  	Offset: 0,
  	Order: "Name"
  }, function(res, err) {
    jt.Render("admin/users", res);
  });
});
