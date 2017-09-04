(function() {

var permute = function(link, arr, options, depth) {
  if (options.length === 0) {
    return;
  }
  var option = options[0];
  if (option.Values) {
    _.each(option.Values, function(value) {
      var l = link + "&" + option.Name + "=" + value;
      if (options.length === 1) {
        arr.push({
          "Name": option.Name + ": " + value,
          "Link": l,
          "Depth": depth,
          "Demonstration": {},
          "Lesson": {}
        });
      } else {
        arr.push({
          "Name": option.Name + ": " + value,
          "Depth": depth
        });
        permute(l, arr, options.slice(1), depth+1);
      }
    });
  } else if (options.length === 1) {
    arr.push({
      "Name": option.Name,
      "Link": link,
      "Depth": depth,
      "Demonstration": {},
      "Lesson": {}
    });
  } else {
    arr.push({
      "Name": option.Name,
      "Depth": depth
    });
    permute(link, arr, options.slice(1), depth+1);
  }
};

var renderTable = function(profile, style, count) {
  var tabs1 = [];
  var tabs2 = [];
  var styleAttributeId = 0;
  var styleId = 0;
  var countAttributeId = 0;
  var countId = 0;
  _.each(jt.Globals.Attributes, function(attribute, i) {
    var attributeId = i+1;
    _.each(jt.Globals.Values, function(value, j) {
      var valueId = j+1;
      if (value.AttributeId === attributeId) {
        if (attribute.Name === "Style") {
          styleAttributeId = attributeId;
          if (value.Name === style) {
            styleId = valueId;
          }
          tabs1.push({
            "name": value.Name,
            "selected": value.Name === style,
            "args": "Style=" + value.Name + "&Count=3"
          });
        } else if (attribute.Name === "Count") {
          countAttributeId = attributeId;
          if (value.Name === count) {
            countId = valueId;
          }
          tabs2.push({
            "name": value.Name,
            "selected": value.Name === count,
            "args": "Style=" + style + "&Count=" + value.Name
          });
        }
      }
    });
  });
  var tricks = [];
  _.each(jt.Globals.Families, function(family, i) {
    var familyId = i+1;
    var hasStyle = _.contains(family.Attributes, styleId);
    var hasCount = _.contains(family.Attributes, countId);
    if (!hasStyle || !hasCount) {
      return;
    }
    var options = [{
      "Name": family.Name,
    }];
    _.each(
      _.groupBy(family.Attributes, function(valueId) { return jt.Globals.Values[valueId-1].AttributeId; }),
      function(values, attributeId) {
        if (+attributeId !== styleAttributeId && +attributeId !== countAttributeId) {
          options.push({
            "Name": jt.Globals.Attributes[attributeId-1].Name,
            "Values": _.map(values, function(v) { return jt.Globals.Values[v-1].Name; })
          });
        }
      }
    );
    permute("/families/" + familyId + "?Style=" + style + "&Count=" + count, tricks, options, 0);
  });

  $("#trick-table").html(jt.RenderTemplate("shared/trick-table", {
    "tabs1": _.sortBy(tabs1, "name"),
    "tabs2": _.sortBy(tabs2, function(t) { return +t.name; }),
    "tricks": tricks
  }));

  $("#trick-table a[data-args]").click(function(evt) {
    evt.preventDefault();

    _.each($(this).attr("data-args").split("&"), function(arg) {
      var nv = arg.split("=");
      if (nv[0] === "Style") {
        style = nv[1];
      }
      if (nv[0] === "Count") {
        count = nv[1];
      }
    });
    renderTable(profile, style, count);
  });
};

jt.Route("/profile", function(req) {
  jt.Api("GetProfile", {
    "Id": jt.Session["User.Id"]
  }, function(profile, err) {
  	if (err) {
  		jt.Navigate("500", {
        "error": err
      });
  		return;
  	}
    jt.Render("profile", profile);

    renderTable(profile, "Balls", "3");
  });
});


})();