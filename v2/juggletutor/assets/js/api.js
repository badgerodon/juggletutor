(function() {

jt.Session = JSON.parse(amplify.store("Session") || "{}");

jt.Api = function(method, args, callback) {
  $.ajax({
    "url": "/api/" + method,
    "data": JSON.stringify(args),
    "dataType": "json",
    "headers": {
      "Session": amplify.store("Session") || "",
      "SessionKey": amplify.store("SessionKey") || ""
    },
    "type": "POST",
    "complete": function(xhr) {
      // Store the updated session
      var session = xhr.getResponseHeader("Session"),
        sessionKey = xhr.getResponseHeader("SessionKey");
      jt.Session = JSON.parse(session);
      amplify.store("Session", session);
      amplify.store("SessionKey", sessionKey);

      // If this was successful call
      if (xhr.status >= 200 && xhr.status < 400) {
        callback(JSON.parse(xhr.responseText), null);
      } else {
        callback(null, xhr.responseText);
      }
    }
  });
};

})();
