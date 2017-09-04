var React = require("react");

var Component = React.createClass({
  render: function() {
    return (
      <div className="main" data-page="Loading">
        <div class="loading">
          <i class="fa-spinner fa-spin"></i>
        </div>
      </div>
    );
  }
});

module.exports = Component;
