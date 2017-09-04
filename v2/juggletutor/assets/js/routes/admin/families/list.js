jt.Route("/admin/families", function(req) {
	if (jt.Session["User.Type"] != "Admin") {
		jt.Render("403", {});
		return;
	}
  jt.Render("admin/families/list", {
  	Families: _.map(jt.Globals.Families, function(family) {
      return {
        "Id": family.Id,
        "Name": family.Name,
        "Attributes": jt.Format.familyAttributes(family.Attributes).split('\n').join('<br>')
      };
    })
  });
});
