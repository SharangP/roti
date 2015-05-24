var SearchView = React.createClass({
    getInitialState: function() {
        return {
            data: [],
            selected: undefined
        };
    },

    componentDidMount: function () {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({data: data, selected: 0});
            }.bind(this),
            error: function () {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    onSelected: function(i) {
      this.setState({ selected: i });
    },

    render: function () {
        var points = this.state.data.map( function(vendor) {
            return vendor.address;
        });

        return (
            <div>
              <h3>Rotis near you</h3>
              <hr/>
              <div className="col-lg-6" id="vendor-list">
                <VendorList 
                  data={ this.state.data }
                  selected={ this.state.selected }
                  onSelected={ this.onSelected }
                  showButton/>
              </div>

              //TODO select vendor when pin is clicked
              <div className="col-lg-5">
                <MapBox
                  data={ points }
                  selected={ this.state.selected }/>
              </div>
            </div>
        );
    }
});
