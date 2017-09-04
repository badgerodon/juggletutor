jt.Route("/", function(req) {
  jt.Render("index", {});
  $("button.google").on("click", function() {
    jt.Navigate("/login");
  });
});
