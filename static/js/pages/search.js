var React = require('react');
var S = require('components/search');

React.render(
  <S.SearchView url="/api/vendor" />,
  document.getElementById("content")
);
