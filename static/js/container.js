var Container = React.createClass({
    getInitialState: function() {
        return {
            data: []
        };
    },

    componentDidMount: function () {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function () {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    render: function () {
        var points = this.state.data.map( function(vendor) {
            return vendor.address;
        });

        return (
            <div>
              <div className="col-lg-6" id="vendor-list">
                <VendorList data={this.state.data} />
              </div>

              <div className="col-lg-5">
                <MapBox data={points}/>
              </div>
            </div>
        );
    }
});

React.render(
    <Container url="/vendors" />,
    document.getElementById("vendor-container")
);
