var React = require('react');
var V = require('components/vendor');

//TODO: parse url to get id
React.render(
  <V.VendorView url={"/api/vendor/" + window.VENDOR_ID}/>,
  document.getElementById("content")
);
