var React = require("react");
var AppDispatcher = require("../../dispatcher/AppDispatcher.js");

var Intro = React.createClass({
  render: function() {
    return (
      <div className="main main-intro">
        <h1>Juggle Tutor</h1>
        <p>The game that can teach you how to juggle</p>
        <div className="buttons">
          <button className="btn" onClick={this.handleClickStart}>Start</button>
        </div>
      </div>
    );
  },

  handleClickStart: function() {
    AppDispatcher.dispatch({
      "actionType": "change-page",
      "page": "TutorialList"
    });
  }
});

module.exports = Intro;
