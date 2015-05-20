// le angular

var roti = angular.module('roti', [], function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

//mapbox service
var mapService = roti.factory('mapService', function() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiYnVoYnVoIiwiYSI6Ilh5bkRKUUUifQ.olgIk6gNL_tuWx_HtqircQ';
    var map = L.mapbox.map;
    var geocoder = L.mapbox.geocoder('mapbox.places');
    var init = function (mapid) {
        map = L.mapbox.map(mapid, 'mapbox.streets');
        return map;
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
        addPoint: addPoint,
        map: map
    }
});

// mapbox directive
mapDirective = roti.directive('map', function(mapService) {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="map-component"></div>',
    scope: {
      options: '='
    },

    link: function(scope, element, attrs) {
      var map = mapService.init('map');
      var defaultOptions = {
        zoom: 13,
        lat: 37.54,
        lng: -122.63
      };

      //scope.$watchCollection('options', goTo);

      function goTo(options) {
        var dest = angular.extend({}, defaultOptions, options);
        map.setView([ dest.lat, dest.lng ], dest.zoom);
      }

      if ('location' in attrs) {
        goTo(JSON.parse(attrs.location));
      }
    }
  };
});


// search logic
var searchController = roti.controller('SearchController', ['mapService', function(mapService) {
    this.query = '';
    this.doQuery = function() {
        var q = this.query;
        mapService.geocoder.query(q, function(err, data) {
            //TODO: maybe handle errors
            window.location.href = "/results?q=" + q + "&lat=" + data.latlng[0] + "&lng=" + data.latlng[1];
        });
    };
}]);

// map controller
var mapController = roti.controller('MapController', ['mapService', function(mapService) {
    this.asdf = "hi";
    this.vendor = "hello world";
}]);

/*
//TODO use actual mapbox api
$(document).ready(function() {
  var geocoder = L.mapbox.geocoder('mapbox.places');
  var map = L.mapbox.map('map', 'mapbox.streets').setView([38.9, -77], 15);
  var addPoint = function(address, pinNumber) {
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
  }
  $(".address").each( function(i,vendor) {
      addPoint(vendor.textContent, 1);
  });

  //TODO: this zooms to some weird location - make it the centroid of all the pins returned
  geocoder.query("{{query}}", function(err, data) {
        if (data.latlng) {
          map.setView([data.latlng[0], data.latlng[1]], 15);
        }
      });
});
*/
