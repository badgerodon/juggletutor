var React = require("react");
var Intro = require("./pages/Intro.react.js");
var TrickList = require("./pages/TrickList.react.js");
var TrickView = require("./pages/TrickView.react.js");
// stores
var AppStore = require("../stores/AppStore.js");

function getState() {
  return {
    page: AppStore.GetPage()
  };
}

var Main = React.createClass({
  getInitialState: function() {
    return getState();
  },
  componentWillMount: function() {
    AppStore.on("change", this._onChange);
  },
  componentWillUnmount: function() {
    AppStore.removeListener("change", this._onChange);
  },
  render: function() {
    switch (this.state.page) {
    case "TrickView":
      return <TrickView />;
    case "TrickList":
      return <TrickList />;
    case "Intro":
    default:
      return <Intro />;
    }
  },
  _onChange: function() {
    this.setState(getState());
  }
});

module.exports = Main;
