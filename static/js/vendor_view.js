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
