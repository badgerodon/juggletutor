var Views = function() {

};
Views.prototype = {
  intro: function() {
    return (
      h("div.screen.screen-intro", [
        h("h1", "Juggle Tutor"),
        h("p", "An interactive game that can teach you to juggle"),
        h("button.btn", {
          onclick: function(evt) {
            evt.preventDefault();
            location.href = "#screen=start";
          }
        }, "Start")
      ])
    );
  },
  start: function() {
    return (
      h("div.screen.screen-start", [

      ])
    );
  }
};
