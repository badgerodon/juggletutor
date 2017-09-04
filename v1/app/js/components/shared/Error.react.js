require("../../../css/components/shared/Error.css");

var React = require("react");

var Component = React.createClass({
  render: function() {
    return (
      <div className="error">
        {this.props.message}
      </div>
    );
  }
});

module.exports = Component;
