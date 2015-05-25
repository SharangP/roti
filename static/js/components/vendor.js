var React = require('react');
var MapBox = require('components/mapbox').MapBox;

var VendorProfile = React.createClass({
  render: function() {
    return (
      <div className="col-lg-3 vendor-info">
        <img src={ this.props.image }/>
        <h3>{ this.props.name }</h3>
        <p>{ this.props.description }</p>
      </div>
    );
  }
});

var ProductList = React.createClass({
  render: function() {
    var products = this.props.data.map(function(product, index) {
      return (
        <div className="row" key={index}>
          <div className="col-lg-3">
            <h5>{ product.name }</h5>
            <img src={ product.image } />
          </div>
          <div className="col-lg-4">
            <br/>
            <br/>
            <p>{ product.description }</p>
          </div>
          <div className="col-lg-1">
            <span className="label">{ product.price }</span>
          </div>
          <div className="col-lg-3">
            <span className="count">0</span>
            <a href="#" className="btn btn-success">+</a>
          </div>
          <hr />
        </div>
      );
    });

    return (
      <div className="product-list">
        {products}
      </div>
    );
  }
});


var VendorView = React.createClass({
    getInitialState: function() {
        return { data: undefined };
    },

    //TODO: json mixin
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

    render: function () {
        if (!this.state.data) {
          return (
            <div className="vendor-container row">
              <center>
                <i className="fa fa-spinner fa-spin fa-2x"></i>
                <br/>
                <br/>
              </center>
            </div>
          );
        }

        return (
          <div className="vendor-container">
            <div className="row">
              <div className="col-lg-2">&nbsp;</div>
              <VendorProfile
                image={ this.state.data.image }
                name={ this.state.data.user.firstname + " " + this.state.data.user.lastname }
                description={ this.state.data.description } />
              <div className="col-lg-5">
                <MapBox data={[this.state.data.address]} selected={0}/>
              </div>
              <div className="col-lg-2">&nbsp;</div>
            </div>
            <hr/>
            <div className="container">
              <div className="row">
                  <div className="col-lg-2">&nbsp;</div>
                  <div className="col-lg-8">
                    <h3>Products</h3>
                    <ProductList data={ this.state.data.products }/>
                    </div>
                    <div className="row order">
                      <div className="col-lg-5">&nbsp;</div>
                      <div className="col-lg-5">
                        <a href="#" className="btn btn-info">Order Now</a>
                      </div>
                      <div className="col-lg-5">&nbsp;</div>
                    </div>
                  <div className="col-lg-2">&nbsp;</div>
              </div>
            </div>
          </div>
        );
    }
});

var VendorListItem = React.createClass({
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
                <VendorListItem
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

module.exports = {
  VendorView,
  VendorList
}
