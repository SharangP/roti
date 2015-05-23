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
            points: ["33 Rausch Street, San Francisco", "10 Market Street, San Francisco"],
        }
    },

    componentDidMount: function () {
        var self = this;
        var map = L.mapbox.map('map', 'mapbox.streets');
        var geocoder = L.mapbox.geocoder('mapbox.places');
        this.state.points.map( function(point) {
            self.addPoint(map, geocoder, point);
        });

        //TODO: fit map bounds to markers
        //var markers = [];
        //map.featureLayer.eachLayer(function(marker) {
            //markers.push(marker);
        //});
        //var group = new L.featureGroup(markers);
        //map.fitBounds(group.getBounds().pad(0.5));

        //TODO: pan to pin
        //map.featureLayer.on('click', function(e) {
            //map.panTo(e.layer.getLatLng());
        //});

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
    <MapBox>
        {points=["94103"]}
    </MapBox>,
    document.getElementById("map")
);
