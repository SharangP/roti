L.mapbox.accessToken = 'pk.eyJ1IjoiYnVoYnVoIiwiYSI6Ilh5bkRKUUUifQ.olgIk6gNL_tuWx_HtqircQ';

var MapBox = React.createClass({
    getInitialState: function() {
      return {
        data: [],
        selected: undefined
      };
    },

    componentDidMount: function () {
        var map = L.mapbox.map('map', 'mapbox.streets');
        var geocoder = L.mapbox.geocoder('mapbox.places');

        this.setState({
            map: map,
            geocoder: geocoder,
            data: this.props.data,
            selected: this.props.selected
        });

        var markers = this.props.data.map(function(address, index) {
          var pan = index === this.props.selected || this.props.data.length === 1;
          return this.addPoint(address, pan, map, geocoder);
        }.bind(this)).filter(function(marker) {
          return marker != undefined && marker != null;
        });
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState({data: nextProps.data, selected: nextProps.selected});
    },

    componentWillUpdate: function(nextProps, nextState) {
        var addresses = [];
        nextState.map.eachLayer(function(marker) {
          if (marker.removable) {
            addresses.push(marker.address);
          }
        });
        var markers = nextState.data.map(function(address, index) {
          var pan = index === nextState.selected || nextState.data.length === 1;
          if (addresses.indexOf(address) === -1) {
            this.addPoint(address, pan);
          } else if (pan) {
            nextState.map.eachLayer(function(marker) {
              if (marker.address === address) {
                nextState.map.setView(marker.getLatLng(), 15);
              }
            });
          }
        }.bind(this));
    },

    addPoint: function(address, pan, map, geocoder) {
        map = map || this.state.map;
        geocoder = geocoder || this.state.geocoder;
        if (!map || !geocoder)
          return;

        geocoder.query(address, function(err, data) {
            if (data.latlng) {
                var marker = L.marker(new L.LatLng(data.latlng[0], data.latlng[1]), {
                    icon: L.mapbox.marker.icon({
                        'marker-color': 'ff8888'
                    })
                }).bindPopup(address).addTo(map);
                marker.removable = true;
                marker.address = address;

                if (pan) {
                  map.setView(marker.getLatLng(), 15);
                }
            }
        }.bind(this));
    },

    render: function () {
        return <div id="map"/>
    }
});
