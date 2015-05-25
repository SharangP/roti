var _ = require('lodash');
var React = require('react');

var Test = React.createClass({
  render: () => {
    return <h1>Test</h1>
  }
});

React.render(
  <Test/>,
  document.getElementById("content"));
