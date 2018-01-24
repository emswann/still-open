/**
 * @file Defines main processing functionality for the Still Open application. 
 * @author Robert Brown, Joshua Lewis, Elaina Swann
 * @version 1.0 
*/

/* These global function declarations are here because other functions outside .ready block need to call them. */
var createMarkers;
var geocodeAddr;

$(document).ready(function () {
  var map, location, marker, geocoder, service, bounds, restMarkers, oms;
  var searchAPIArray = [];
  var restInfoArray = [];
  var markerArray = [];
  var meterCount;

  /** 
   * @function initialize (self-invoking)
   * @description Initializes application.
  */
  (function initialize() {
    $('.radio-button').prop('disabled', true);
    $('#radius').hide();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(googleMap, promptUserAddr);
    } 
    else {
      promptUserAddr();
    }
  })();

  /** 
   * @function promptUserAddr
   * @description Pops up address modal.
  */
  function promptUserAddr() {
    $('#addr-modal').modal('show');
  }

  /** 
   * @function googleMap
   * @description Gets user geolocation using Googles Map.
   * @param {Object} position Object with latitude and longitude.
  */
  function googleMap(position) {
    location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    bounds = new google.maps.LatLngBounds();

    console.log('GM Latitude: ' + location.lat());
    console.log('GM Longitude: ' + location.lng());

    renderMap();
  }

  /** 
   * @function renderMap
   * @description Renders map using Google Maps, Marker, and Spiderfier.
  */
  function renderMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 100,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    marker = new google.maps.Marker({
      map: map,
      position: location,
      animation: google.maps.Animation.DROP,
      title: 'This is your location',
      icon: 'assets/images/bluemarker.png'
    });

    map.setCenter(location);
    
    oms = new OverlappingMarkerSpiderfier(map, {
      markersWontMove: true,
      markersWontHide: true
    });

    oms.addListener('format', function(marker, status) {
      var iconURL = 
        status == OverlappingMarkerSpiderfier.markerStatus.SPIDERFIED 
          ? 'assets/images/greenmarker.png' 
          : status == OverlappingMarkerSpiderfier.markerStatus.SPIDERFIABLE 
            ? 'assets/images/pinkmarker.png' 
            : status == OverlappingMarkerSpiderfier.markerStatus.UNSPIDERFIABLE
              ? 'assets/images/greenmarker.png' 
              : null;
      marker.setIcon({
        url: iconURL
      });
    });
    
    $('#map').css('box-shadow', '0px 0px 10px #3be1ec, 0px 0px 10px #3be1ec');
    $('#radius').show();
    getRestaurants();
  }

  /** 
   * @function centerMap
   * @description Centers map based on user location.
  */
  function centerMap() {
    markerArray.forEach(marker => {
      bounds.extend(marker.getPosition());
    })

    map.fitBounds(bounds);
    map.setCenter(location);
  }

  /** 
   * @function geocodeAddr
   * @description Geocodes user address using Google Geocoder.
   * @param {string} addressStr Comma delimited user address.
  */
  geocodeAddr = function (addressStr) {
    var geocoder = new google.maps.Geocoder();
    var appError;

    geocoder.geocode({
      address: addressStr
    }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        console.log('GeoCoder: ', results);
        location = results[0].geometry.location;
        bounds = new google.maps.LatLngBounds();
        renderMap();
      } 
      else {
        processError(status);
      }
    });
  }

  /**
   * @async
   * @function getRestaurants
   * @description Complete processing to go from API search data to Restaurant detail info in a app friendly format. Uses Google Places, Google Places Details.
  */
  async function getRestaurants() {
    try {
      const MAX_QUERY_SIZE = 9;
      const NUMBER_OF_RAD_BUTTONS = 3
      const METERS_TO_MILES = [0, 1609.34, 3218.69, 6437.38];

      var dummyVar = 0;
      var detailAPIArray = [];

      for (var i = 1; i <= NUMBER_OF_RAD_BUTTONS; i++) {
        var element = $('#radio-button-' + i)
        var meters = [0, 1609.34, 3218.69, 6437.38];
        if (element.prop('checked')) {
          meterCount = METERS_TO_MILES[i]
        }
          console.log(meterCount)
      }

      /* Use current location (global variable) to determine restaurant list. */
      console.log('RL Latitude: ' + location.lat());
      console.log('RL Longitude: ' + location.lng());
      service = new google.maps.places.PlacesService(map);

      try {
        searchAPIArray = await nearBySearch();
        dummyVar = await delayProcess(1000);
      }
      catch(error) {
        throw(error);
      }
      console.log('S: ', searchAPIArray);

      var chunkArray = divideArray(searchAPIArray, MAX_QUERY_SIZE);
      console.log('Chunk: ', chunkArray);

      var result;
      for (let i = 0; i < chunkArray.length; i++) {
        try {
          result = await processSlice(chunkArray[i]);
          dummyVar = await delayProcess(3950);
        }
        catch (error) {
          /* Wait and try one more time. Then forget about it. Go ahead and fail. */
          try {
            console.log('Google Places Details failed...trying again.');
            dummyVar = await delayProcess(4500);
            result = await processSlice(chunkArray[i]);
            dummyVar = await delayProcess(3950);
          }
          catch (error) {
            throw(error);
          }
        }

        /* Do this after the delay. */
        console.log('D-' + i + ': ', result);
        detailAPIArray = detailAPIArray.concat(result);
      }

      restInfoArray = new Restaurants(searchAPIArray, detailAPIArray);
      console.log('R: ', restInfoArray);

      renderList(restInfoArray);

      $('.radio-button').prop('disabled', false);
    }
    catch (error) {
      processError(error);
    }
  }

  /**
   * @async
   * @function processSlice
   * @description Processes chunk of API Nearby Search array to get detail info for each restaurant.
   * @param {Object[]} array - Restaurant object array.
  */
  function processSlice(array) {
    return Promise.all(array.map(findDetail));
  }

  /**
   * @async
   * @function nearBySearch
   * @description API request for Google Places (Nearby Search).
  */
  function nearBySearch() {
    var request = {
      location: {
        lat: location.lat(),
        lng: location.lng()
      },
      rankBy: google.maps.places.RankBy.DISTANCE,
      type: 'restaurant',
      openNow: true
    };

    return new Promise((resolve, reject) => {
      var filteredRadiusArray = [];
      service.nearbySearch(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {

          function checkRadiusDistance(place, centerLatLng, radius) {
            return google.maps.geometry.spherical.computeDistanceBetween(place.geometry.location, centerLatLng) < radius
          }
          for (var i = 0; i < results.length; i++) {
            if (checkRadiusDistance(results[i], location, meterCount)) {
              filteredRadiusArray.push(results[i]);
            }
          }
          resolve(filteredRadiusArray);
        } 
        else {
          reject(status);
        }
      });
    });
  }

  /**
   * @async
   * @function findDetail
   * @description API request for Google Places Details.
   * @param {Object} place - Restaurant object.
  */
  function findDetail(place) {
    return new Promise((resolve, reject) => {
      service.getDetails({
        placeId: place.place_id
      },
      function (place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(place);
        } 
        else {
          reject(status);
        }
      });
    });
  }

  /**
   * @function createMarkers
   * @description Adds restaurant markers to the map using Google Geocoder, Marker.
   * @param {Object} latlng - Google API specific latitude/longitude object.
   * @param {string} name - Restaurant name.
  */
  createMarkers = function (latlng, name) {
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({
      address: latlng
    }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        console.log('GeoCoder: ', results);
        markerArray.push(
          new google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
            animation: google.maps.Animation.DROP,
            title: name,
          }));
          for (var i = 0; i < markerArray.length; i++) {
            var element = markerArray[i];
            oms.addMarker(element)
          }
          
        console.log(markerArray)
        centerMap();
      } 
      else {
        console.log('Geocoder error: Marker for ' + name + ' not added.');
      }
    });
  }

  /**
   * @function changeCheckedRadius
   * @description Renders map when user changes map radius.
  */
  function changeCheckedRadius() {
    renderMap(); 
    $('.radio-button').prop('disabled', true);
  }

  /**
   * @function processAddrModal
   * @description Top level function to handle when user submits address via modal.
  */
  function processAddrModal() {
    event.preventDefault();
    processAddr();
  }

  /**
   * @function reloadPage
   * @description Reloads webpage.
  */
  function reloadPage() {
    window.location.reload(true);
  }

  /**
   * @function runRestModal
   * @description Top level function to handle when user requests additional restaurant info.
  */
  function runRestModal() {
    renderRestModal(restInfoArray[parseInt($(this).attr('data-index'))]); 
  }

  /** 
   * @event .on ("click") 
   * @listens .radio-button User changes map radius. 
   * @param {function} changeCheckedRadius
  */
  $('.radio-button').on('click', changeCheckedRadius);

  /** 
   * @event .on ("click") 
   * @listens #btn-addr-submit User submits address via modal. 
   * @param {function} processAddrModal
  */
  $('#btn-addr-submit').on('click', processAddrModal);

  /** 
   * @event .on ("click") 
   * @listens .reload User closes address modal (X or close), user closes or submits refresh via error modal. 
   * @param {function} reloadPage
  */
  $('.reload').on('click', reloadPage);

  /** 
   * @event .on ("click") 
   * @listens [id^=item-] User clicks restaurant for additional info. 
   * @param {function} runRestModal
  */
  $(document).on('click', '[id^=item-]', runRestModal);
});

