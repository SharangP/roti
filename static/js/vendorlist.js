var Vendor = React.createClass({
    render: function () {
        return (
            <a className="list-group-item row" href="">
                <div className="col-lg-3">
                    <img src={ this.props.image } />
                </div>
                <h4 className="list-group-item-heading">{ this.props.user }</h4>
                <i className="list-group-item-text address">{ this.props.address }</i>
                <p className="list-group-item-text description">{ this.props.description }</p>
            </a>
        );
    }
});

var VendorList = React.createClass({

    render: function () {
        var vendors = this.props.data.map( function (vendor) {
            return (
                <Vendor image={vendor.image} user={vendor.user} address={vendor.address} description={vendor.description} />
            );
        });

        return (
            <div>
                {vendors}
            </div>
        );
    }
});
