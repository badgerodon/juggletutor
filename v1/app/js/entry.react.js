require("normalize.css");
require("../css/main.css");
require("../css/TutorialList.css");

var React = require("react");
var Main =require("./components/Main.react.js");

window.onload = function() {
  React.render(
    <Main />,
    document.body
  );
};
