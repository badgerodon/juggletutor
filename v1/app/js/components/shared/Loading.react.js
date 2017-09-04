require("../../../css/components/shared/Loading.css");

var React = require("react");

var Component = React.createClass({
  render: function() {
    return (
      <div className="loading">
        <i className="fa fa-spinner fa-spin"></i>
      </div>
    );
  }
});

module.exports = Component;
