L.mapbox.accessToken = 'pk.eyJ1IjoiYnVoYnVoIiwiYSI6Ilh5bkRKUUUifQ.olgIk6gNL_tuWx_HtqircQ';

var MapBox = React.createClass({
    addPoint: function(address) {
        this.state.geocoder.query(address, function(err, data) {
            if (data.latlng) {
                this.state.map.setView([data.latlng[0], data.latlng[1]], 15);
                var fixedMarker = L.marker(new L.LatLng(data.latlng[0], data.latlng[1]), {
                    icon: L.mapbox.marker.icon({
                        'marker-color': 'ff8888'
                    })
                }).bindPopup(address).addTo(this.state.map);
            }
        }.bind(this));
    },

    componentDidMount: function () {
        var map = L.mapbox.map('map', 'mapbox.streets');
        var geocoder = L.mapbox.geocoder('mapbox.places');

        //TODO: pan to pin
        //map.featureLayer.on('click', function(e) {
            //map.panTo(e.layer.getLatLng());
        //});

        this.setState({
            query: "San Francisco, CA",
            map: map,
            geocoder: geocoder
        });
    },

    componentWillReceiveProps: function (nextProps) {
        nextProps.data.map(this.addPoint);

        //TODO: remove points from map too
        //TODO: fit map bounds to markers
        //var markers = [];
        //map.featureLayer.eachLayer(function(marker) {
            //markers.push(marker);
        //});
        //var group = new L.featureGroup(markers);
        //map.fitBounds(group.getBounds().pad(0.5));
    },

    render: function () {
        return <div id="map"/>
    }
});
