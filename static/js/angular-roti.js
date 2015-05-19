// le angular

var roti = angular.module('roti', [], function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});


// mapbox directive
//module.exports = function(MapboxService) {
  //return {
    //restrict: 'E',
    //replace: true,
    //template: '<div class="map-component"></div>',
    //scope: {
      //options: '='
    //},
    //link: function(scope, element, attrs) {
      //var map;
      //var defaultOptions = {
        //zoom: 12,
        //lat: 45.54,
        //lng: -122.63
      //};

      //MapboxService.mapbox.accessToken = 'pk.eyJ1IjoiZWtudXRoIiwiYSI6InA5TFJabjAifQ.zOTDOdaBSMPwZY8ez12r_A';
      //map = MapboxService.mapbox.map(element[0], 'examples.map-y7l23tes');

      //scope.$watchCollection('options', goTo);

      //function goTo(options) {
        //var dest = angular.extend({}, defaultOptions, options);
        //map.setView([
            //dest.lat,
            //dest.lng
          //],
          //dest.zoom);
      //}
    //}
  //};
//};

//mapbox service
var mapService = roti.factory('mapService', function() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiYnVoYnVoIiwiYSI6Ilh5bkRKUUUifQ.olgIk6gNL_tuWx_HtqircQ';
    //var mapbox = angular.extend({}, L);
    var geocoder = L.mapbox.geocoder('mapbox.places');
    var init = function (mapid) {
        this.map = L.mapbox.map(mapid, 'mapbox.streets').setView([38.9, -77], 15);
    };

    // add a latlng to the map
    var addPoint = function(latlng, pinNumber) {
        var fixedMarker = L.marker(new L.LatLng(latlng[0], latlng[1]), {
            icon: L.mapbox.marker.icon({
                'marker-color': 'ff8888'
            })
        }).bindPopup(latlng).addTo(this.map);
    }

    return {
        geocoder: geocoder,
        init: init,
        addPoint: addPoint
    }
});

// search logic
var searchController = roti.controller('SearchController', ['mapService', function(mapService) {
    this.query = '';
    this.doQuery = function() {
        mapService.geocoder.query(this.query, function(err, data) {
            //TODO: maybe handle errors
            window.location.href="results?lat=" + data.latlng[0] + "lng=" + data.latlng[1];
        });
    };
}]);
