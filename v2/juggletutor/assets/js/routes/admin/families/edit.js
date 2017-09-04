(function() {

var edit = function(obj) {
  jt.Render("admin/families/edit", obj);

  $("#admin-family").on("submit", function(evt) {
    evt.preventDefault();
    var id = $(this).find("[name=Id]").val();
    var name = $(this).find("[name=Name]").val();
    var attributes = [];
    _.each($(this).find("[name=Attributes]").val().split("\n"), function(ln) {
      var parts = ln.split(':');
      if (parts.length == 1) {
        return;
      }

      var familyName = parts[0].trim();
      var values = _.map(parts[1].split(","), function(o) {
        return {
          "Name": o.trim()
        };
      });
      attributes.push({
        "Name": familyName,
        "Values": values
      });
    });
    jt.Api("SaveFamily", {
      "Id": +id || 0,
      "Name": name,
      "Attributes": attributes
    }, function(globals, err) {
      if (err) {
        console.warn(err);
        jt.Navigate("/");
        return;
      }
      jt.Globals = globals;
      jt.Navigate("/admin/families");
    })
  })
};

jt.Route("/admin/families/<id>/edit", function(req) {
  if (jt.Session["User.Type"] != "Admin") {
    jt.Render("403", {});
    return;
  }
  var id = +req.URL.Query.id;

  var family = jt.Globals.Families[id-1];
  if (!family) {
    jt.Render("404", {});
    return;
  }

  edit({
    "Id": id,
    "Name": family.Name,
    "Attributes": jt.Format.familyAttributes(family.Attributes)
  });
});

jt.Route("/admin/families/new", function(req) {
  if (jt.Session["User.Type"] != "Admin") {
    jt.Render("403", {});
    return;
  }
  edit({
    "Id": "",
    "Name": "",
    "Attributes": ""
  });
});

})();
