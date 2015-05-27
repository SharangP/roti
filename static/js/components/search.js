var React = require('react');
var Reflux = require('reflux');
var MapBox = require('components/mapbox').MapBox;
var VendorSearchActions = require('actions/vendor_search');
var VendorSearchStore = require('stores/vendor_search');
var V = require('components/vendor');

var SearchView = React.createClass({
    mixins: [Reflux.connect(VendorSearchStore)],
    componentDidMount: function() {
        VendorSearchActions.loadVendors();
    },

    onSelected: function(i) {
        VendorSearchActions.select(i);
    },

    render: function () {
        var points = this.state.vendors.map( function(vendor) {
            return vendor.address;
        });

        var list;
        if (this.state.vendors.length === 0) {
            list = <p>No rotis found :(</p>;
        } else {
            list = (
                <V.VendorList
                  data={ this.state.vendors }
                  selected={ this.state.selected }
                  onSelected={ this.onSelected }
                  showButton/>
            );
        }

        //TODO select vendor when pin is clicked
        return (
            <div className="container vendor-container">
              <h3>Rotis near you</h3>
              <hr/>
              <div className="col-lg-6" id="vendor-list">
                { list }
              </div>

              <div className="col-lg-5">
                <MapBox
                  data={ points }
                  selected={ this.state.selected }/>
              </div>
            </div>
        );
    }
});

module.exports = { SearchView };
