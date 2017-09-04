var React = require("react");
var AppDispatcher = require("../../dispatcher/AppDispatcher.js");
var AppStore = require("../../stores/AppStore.js");
var TrickStore = require("../../stores/TrickStore.js");
// components
var Header = require("../shared/Header.react.js"),
  Loading = require("../shared/Loading.react.js"),
  Error = require("../shared/Error.react.js");

function getState() {
  return {
    Tricks: TrickStore.GetTricks(),
    IsLoading: TrickStore.IsLoading(),
    Error: TrickStore.GetError()
  };
}


var Item = React.createClass({
  render: function() {
    var data = this.props.data;
    return (
      <li onClick={this.handleClick}>
        <span className="info">
          <i className={"fa fa-eye" + (data.Watched ? " completed" : "")}></i>
          <i className={"fa fa-trophy" + ((data.MachineVerified || data.SocialVerified) ? " completed" : "")}></i>
        </span>
        {data.Title}
      </li>
    );
  },
  handleClick: function(evt) {
    AppDispatcher.dispatch({
      "Action": "TrickView",
      "ID": this.props.data.ID
    });
  }
});

var Component = React.createClass({
  getInitialState: function() {
    return getState();
  },
  componentWillMount: function() {
    TrickStore.on("change", this.handleStoreChange);
  },
  componentWillUnmount: function() {
    TrickStore.removeListener("change", this.handleStoreChange);
  },
  render: function() {
    var body;
    if (this.state.IsLoading) {
      body = <Loading />;
    } else if (this.state.Error) {
      body = <Error message={this.state.Error} />;
    } else {
      body = <ul>
        {this.state.Tricks.map(function(trick) {
          return <Item key={trick.ID} data={trick} />
        })}
      </ul>;
    }

    return (
      <div className="main" data-page="TutorialList">
        <Header />
        <h1>Tutorials</h1>
        {body}
      </div>
    );
  },

  handleStoreChange: function() {
    this.setState(getState());
  }
});

module.exports = Component;
