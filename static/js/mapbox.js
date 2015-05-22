var MapBox = React.createClass({
    goToQuery: function () {
        geocoder.query(q, function(err, data) {
            if (data.latlng) {
                map.setView([data.latlng[0], data.latlng[1]], 15);
            }
        });
    },

    addPoint: function(map, geocoder, address) {
        geocoder.query(address, function(err, data) {
            if (data.latlng) {
                map.setView([data.latlng[0], data.latlng[1]], 15);
                var fixedMarker = L.marker(new L.LatLng(data.latlng[0], data.latlng[1]), {
                    icon: L.mapbox.marker.icon({
                        'marker-color': 'ff8888'
                    })
                }).bindPopup(address).addTo(map);
            }
        });
    },

    getInitialState: function () {
        L.mapbox.accessToken = 'pk.eyJ1IjoiYnVoYnVoIiwiYSI6Ilh5bkRKUUUifQ.olgIk6gNL_tuWx_HtqircQ';
        return {
            points: ["33 Rausch Street, San Francisco", "20 Rausch Street, San Francisco"],
        }
    },

    componentDidMount: function () {
        var self = this;
        var map = L.mapbox.map('map', 'mapbox.streets').setView([38.9, -122], 15);
        var geocoder = L.mapbox.geocoder('mapbox.places');
        var points = this.state.points.map( function(point) {
            self.addPoint(map, geocoder, point);
        });

        return {
            query: "San Francisco, CA",
            map: map,
            geocoder: geocoder
        };
    },

    render: function () {
        return <div id="map" points={this.state.points}/>
    }
});

React.render(
    <MapBox />,
    document.getElementById("map")
);
