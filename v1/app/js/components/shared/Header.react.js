require("../../../css/components/shared/Header.css");

var React = require("react");
var AppDispatcher = require("../../dispatcher/AppDispatcher.js");
var AppStore = require("../../stores/AppStore.js");

var Component = React.createClass({
  render: function() {
    return (
      <div className="header">
        <div className="actions">
          <i className="fa fa-gear"></i>
          <i className="fa fa-sign-out"></i>
        </div>
        <div className="app-name">Juggle Tutor</div>
      </div>
    );
  }
});

module.exports = Component;
