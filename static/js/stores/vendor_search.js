var Reflux = require('reflux');
var request = require('superagent');
var VendorSearchActions = require('actions/vendor_search');

var VendorSearchStore = Reflux.createStore({
    listenables: [VendorSearchActions],
    init: function() {
        this.listenTo(VendorSearchActions.loadVendors, this.fetchData);
    },
    getInitialState: function() {
        this.state = {
            vendors: [],
            selected: undefined
        };
        return this.state;
    },

    fetchData: function() {
        request
            .get('/api/vendor')
            .accept('application/json')
            .end(function(err, res) {
                if (res.ok) {
                    this.state.vendors = JSON.parse(res.text);
                    if (this.state.vendors.length > 0) {
                        this.state.selected = 0;
                    } else {
                        this.state.selected = undefined;
                    }
                    this.trigger(this.state);
                } else {
                    console.error(res.text);
                }
        }.bind(this));
    },

    onSelect: function(i) {
        this.state.selected = i;
        this.trigger(this.state);
    }
});

module.exports = VendorSearchStore;
