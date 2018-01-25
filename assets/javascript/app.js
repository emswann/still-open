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
  var markerArray;
  var meterCount;
  var legend = document.getElementById('legend');
     

  /** 
   * @function initialize (self-invoking)
   * @description Initializes application.
  */
  (function initialize() {
    $('.radio-button').prop('disabled', true);
    $('#radius').hide();
    $('#legend').hide();
    $('#center-map').hide();
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
    markerArray = [];      
    $("#list-container").empty();
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 100,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    
    marker = new google.maps.Marker({
        map: map,
        position: location,
        animation: google.maps.Animation.DROP,
        title: 'This is your location',
        icon: 'assets/images/myLocation.png'
    });
    
    map.setCenter(location);
    
    oms = new OverlappingMarkerSpiderfier(map, {
        markersWontMove: true,
        markersWontHide: true,
        keepSpiderfied: true
    });
    
    oms.addListener('format', function(marker, status) {
        var iconURL = 
        status == OverlappingMarkerSpiderfier.markerStatus.SPIDERFIED 
        ? 'assets/images/restMarker.png' 
        : status == OverlappingMarkerSpiderfier.markerStatus.SPIDERFIABLE 
        ? 'assets/images/groupMarker.png' 
        : status == OverlappingMarkerSpiderfier.markerStatus.UNSPIDERFIABLE
        ? 'assets/images/restMarker.png' 
        : null;
        marker.setIcon({
            url: iconURL
        });
    });
    
    createLegend();
    $('#map').css('box-shadow', '0px 0px 10px #3be1ec, 0px 0px 10px #3be1ec');
    $('#center-map').show();
    $('#legend').show();
    $('#radius').show();
    getRestaurants();
  }

  /** 
   * @function createLegend
   * @description Creates a legend within the Google Map div.
  */
  function createLegend() {
    while (legend.firstChild) legend.removeChild(legend.firstChild);
      
    var title = document.createElement('h4');
    title.innerHTML = 'Legend';
    legend.appendChild(title);

    var div = document.createElement('div');
    div.innerHTML = '<span><img src="assets/images/myLocation.png">Your Location</span>';
    legend.appendChild(div);
    
    var div = document.createElement('div');
    div.innerHTML = '<span><img src="assets/images/restMarker.png">Restaurants</span>';
    legend.appendChild(div);
    
    var div = document.createElement('div');
    div.innerHTML = '<span><img src="assets/images/groupMarker.png">Group of Restaurants</span>';
    legend.appendChild(div);

    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);
  }

  $('#center-map').on('click', centerMap);

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
      var getRStart = moment();

      const MAX_QUERY_SIZE = 1;
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
        dummyVar = await delayProcess(100);
      }
      catch(error) {
        throw(error);
      }
      console.log('S: ', searchAPIArray);

      var chunkArray = divideArray(searchAPIArray, MAX_QUERY_SIZE);
      console.log('Chunk: ', chunkArray);

      var detailsStart = moment();

      var detailsDelay = 120;
      var result;
      for (let i = 0; i < chunkArray.length; i++) {
        try {
          result = await processSlice(chunkArray[i]);
          dummyVar = await delayProcess(detailsDelay);
        }
        catch (error) {
          /* Wait and try one more time. Then forget about it. Go ahead and fail. */
          try {
            console.log('Google Places Details failed...trying again.');

            /* Google requires 1 second wait before requesting again after a failure. */
            dummyVar = await delayProcess(1100);
            result = await processSlice(chunkArray[i]);
            dummyVar = await delayProcess(detailsDelay);
          }
          catch (error) {
            throw(error);
          }
        }

        /* Do this after the delay. */
        console.log('D-' + i + ': ', result);
        detailAPIArray = detailAPIArray.concat(result);
      }

      var detailsEnd = moment();
      console.log('Elapsed Time - details: ', moment.duration(detailsEnd.diff(detailsStart)));

      restInfoArray = new Restaurants(searchAPIArray, detailAPIArray);
      console.log('R: ', restInfoArray);

      renderList(restInfoArray);

      var getRStop = moment();
      console.log('Elapsed Time - getRests: ', moment.duration(getRStop.diff(getRStart)));

      /* Delay radius button availability a bit to make sure have enough time passed to query the APIs again. */
      dummyVar = await delayProcess(500);
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
   * @param {string} address - Restaurant address
   * @param {string} name - Restaurant name.
  */
  createMarkers = function (address, name, phone, cost, url) {
    
        var infoContent = 
        '<div class="info-content"><h4 id="rest-name">' + name + '</h4><br><P>Address: ' + address + '<br>Cost: ' + cost + '<br>Phone: ' + phone + '<br>URL: <a href="' + url + '" target="_blank">' + url + '</a></P></div>';
        
    
        var infoWindow = new google.maps.InfoWindow({
            content: ''
        });
        
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({
      address: address
    }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        console.log('GeoCoder: ', results);
        markerArray.push(
          new google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
            animation: google.maps.Animation.DROP,
            title: name,
            info: infoContent
          }));
          for (var i = 0; i < markerArray.length; i++) {
              markerArray[i].addListener('dblclick', function() {
                  infoWindow.close();
                  infoWindow.setContent(this.info);
                  infoWindow.open(map, this)
                });
                map.addListener('click', function() {
                    infoWindow.close();
                })
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

