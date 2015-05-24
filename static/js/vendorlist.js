var Vendor = React.createClass({
    render: function () {
        var containerClassString = "list-group-item row";
        if (this.props.selected) {
          containerClassString += " active";
        }

        var button;
        var infoClassString = "col-lg-9";
        if (this.props.showButton) {
          button = (
              <div className="col-lg-2">
                <a href={"/vendor/" + this.props.id}
                   className="btn btn-success">Buy rotis</a>
              </div>
          );
          infoClassString = "col-lg-7";
        }

        return (
            <div className={containerClassString} onClick={this.props.onClick}>
                <div className="col-lg-3">
                  <img src={ this.props.image } />
                </div>
                <div className={infoClassString}>
                  <h4 className="list-group-item-heading">
                    { this.props.user }
                  </h4>
                  <i className="list-group-item-text address">
                    { this.props.address }
                  </i>
                  <p className="list-group-item-text description">
                    { this.props.description }
                  </p>
                </div>
                { button }
            </div>
        );
    }
});

var VendorList = React.createClass({
    onClick: function(index) {
      return this.props.onSelected(index);
    },

    render: function () {
        var vendors = this.props.data.map( function (vendor, idx) {
            return (
                <Vendor
                  id={vendor.id}
                  key={idx}
                  image={vendor.image}
                  user={vendor.user}
                  address={vendor.address}
                  description={vendor.description}
                  selected={idx == this.props.selected}
                  onClick={this.onClick.bind(this, idx)}
                  showButton={this.props.showButton}/>
            );
        }.bind(this));

        return (
            <div>
                {vendors}
            </div>
        );
    }
});
