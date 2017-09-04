(function() {

var refresh = function() {
  jt.Api("GetVideos", {
    Offset: 0,
    Limit: 10,
    Attributes: {},
    Status: "Submitted"
  }, function(res, err) {
    jt.Render("admin/videos", {
      "Videos": res
    });
  });
};

jt.Route("/admin/videos", function(req) {
  if (jt.Session["User.Type"] != "Admin") {
    jt.Render("403", {});
    return;
  }
  refresh();
});

$("body")
  .on("click", "#admin-videos .reject", function(evt) {
    evt.preventDefault();

    var $form = $(this).closest("form");

    jt.Api("UpdateVideo", {
      "Id": +$form.find("[name=Id]").val(),
      "Status": "Rejected",
      "StatusDescription": $form.find("[name=StatusDescription]").val()
    }, function(res, err) {
      if (err) {
        alert(err);
        return
      }
      refresh();
    });
  })
  .on("click", "#admin-videos .approve", function(evt) {
    evt.preventDefault();

    var $form = $(this).closest("form");

    jt.Api("UpdateVideo", {
      "Id": +$form.find("[name=Id]").val(),
      "Status": "Approved",
      "StatusDescription": $form.find("[name=StatusDescription]").val()
    }, function(res, err) {
      if (err) {
        alert(err);
        return
      }
      refresh();
    });
  })

})();