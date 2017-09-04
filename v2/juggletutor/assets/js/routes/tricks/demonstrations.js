jt.Route("/tricks/<id>/demonstrations", function(req) {
  jt.Api("GetTrickDemonstrations", {
    "FamilyId": req.id,
    "Properties": {
      1:1
    }
  });
  jt.Render("tricks/demonstrations")
})