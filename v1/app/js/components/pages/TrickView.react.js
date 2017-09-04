var React = require("react");
var AppDispatcher = require("../../dispatcher/AppDispatcher.js");
var TrickStore = require("../../stores/TrickStore.js");

var Header = require("../shared/Header.react.js");

function getState() {
  return {
    Error: TrickStore.GetError(),
    Trick: TrickStore.GetTrick()
  };
}

var Component = React.createClass({
  getInitialState: function() {
    return getState();
  },
  render: function() {
    if (this.state.Error) {
      return (
        <div className="main trick-view">
          <Header />
          <h1>Error</h1>
          <div className="error">
            {this.state.Error}
          </div>
        </div>
      )
    }

    return (
      <div className="main trick-view">
        <Header />
        <h1>???</h1>
        <div className="panel">
          <ul className="tabs">
            <li className="selected">Tutorial</li>
            <li>Practice</li>
            <li>Perform</li>
          </ul>
          <div className="panel-body">
            <iframe src="https://www.youtube.com/embed/kCt1bmSASCI?controls=2&rel=0&showinfo=0"></iframe>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Component;
