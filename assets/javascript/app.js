$(document).ready(function () {
    var map, location, marker, geocoder, service, infowindow;
    var infoArray = [];
    var restInfoArray = [];

    // Immediately (self) invoked function which initializes application after document is loaded.
    (function initialize() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(GoogleMap, promptUserAddr);
        } else {
            promptUserAddr();
        }
    })();

    function GoogleMap(position) {
        location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        console.log("GM Latitude: " + location.lat());
        console.log("GM Longitude: " + location.lng());

        renderMap();
    }

    function renderMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        marker = new google.maps.Marker({
            map: map,
            position: location,
            animation: google.maps.Animation.DROP,
            title: "This is your location",
            icon: "assets/images/bluemarker.png"
        });

        map.setCenter(location);
        service = new google.maps.places.PlacesService(map);
        renderRestList();
    }

    // Removed call to showError in navigator.geolocation.
    // Need to add call to appropriate function for error handling.
    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.")
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.")
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.")
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.")
                break;
        }
    }

    function promptUserAddr() {
        $("#addr-modal").modal("show");
    }
<<<<<<< HEAD
})
    
    $("#addr-modal").modal("show");

    //hardcoded for now, will grab these dynamically later
    var lat = 32.07967
    var long = -81.0927

    var queryURL = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?";

    const API_KEY = "Kgr239ubbiqdhS_iZKqYRUeLSSQB085HltHPbeeQoPb_TXjRrjhFRCn8YKQ9h9j6YSzfG7znnvTdGQPCykmGNMOpzX1vjGJ7NpTFXb0pka_jOXdgfQxvfwsfKCdaWnYx";

    const authHeader = {
        Authorization: "Bearer " + API_KEY
    };

    queryURL += $.param({
        term: 'restaurants',
        latitude: lat,
        longitude: long
    });

    $.ajax({
        url: queryURL,
        method: 'GET',
        headers: authHeader,
    }).done(function (response) {

        var array = response.businesses;
        var infoArray = [];

        //pulls vendor info from API array
        var vendorLoop = function (arg) {
            var vendorArray = [];
            if (Array.isArray(array)) {
                for (var n = 0; n < arg.length; n++) {
                    var element = arg[n].title;
                    vendorArray.push(element);
                }
                return vendorArray;
            }
        }
=======
>>>>>>> eb55edfdd08c21713e1413101dc1676dc4c08cd2

    function convertAddr(addressObj) {

        var addressStr = addressObj.street + "," + 
                         addressObj.city + "," +
                         addressObj.state + "," +
                         addressObj.zipcode;

        // Need to validate address here.

        return addressStr;
    }

    function geocodeAddr(addressStr) {
        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({address: addressStr}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                console.log("GeoCoder: ", results);
                location = results[0].geometry.location;
                renderMap();
            }
            else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    function processAddr() {
        event.preventDefault();
        $("#addr-modal").modal("hide");
        
        var addressObj = {
            "street"  : $("#addr-street").val().trim().toUpperCase(),
            "city"    : $("#addr-city").val().trim().toUpperCase(),
            "state"   : $("#addr-state").val().trim().toUpperCase(),
            "zipcode" : $("#addr-zipcode").val()
        }

        console.log("Input Address: ", addressObj);
        var addressStr = "";

        if ((addressStr = convertAddr(addressObj)) !== "") {
            geocodeAddr(addressStr);
        }
        else {
            console.log("processAddr: Handle this error.");
        }
    }

    var renderRestList = function () {

        // Use current location (global variable) to determine restaurant list.
        console.log("RL Latitude: " + location.lat());
        console.log("RL Longitude: " + location.lng());

        infowindow = new google.maps.InfoWindow();
        service.nearbySearch({
            location: {
                lat: location.lat(),
                lng: location.lng()
            },
            radius: 2000,
            type: ['restaurant']
        }, callback);

        function callback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                results.forEach(createRestArr);
            }
        }

        function createRestArr(place) {
            var request = {
                placeId: place.place_id
            };
            service.getDetails(request, function (details, status) {
                if (details !== null) {
                    infoArray.push(details)
                }

                function costFormat (arg) {
                    if (arg === 0) {
                        return 'Free';
                    }
                    else if (arg === 1) {
                        return '$';
                    }
                    else if (arg === 2) {
                        return '$$';
                    }
                    else if (arg === 3) {
                        return '$$$';
                    }
                    else if (arg === 4) {
                        return '$$$$';
                    } else {
                        return 'No pricing info'
                    }
                }

                function openHoursFormat (arg) {
                    if (arg === true) {
                        return 'Open';
                    }
                    else if (arg === false) {
                        return 'Closed'
                    } 
                    else if (arg === undefined) {
                        return 'No business data available'
                    }
                }

                for (var i = 0; i < infoArray.length; i++) {
                    var restArray = infoArray[i];
                    var restObj = {
                        restName: restArray.name,
                        restCost: costFormat(restArray.price_level),
                        restLoc: restArray.formatted_address,
                        restOpen: openHoursFormat(restArray.opening_hours.open_now),
                        restHours: restArray.opening_hours.weekday_text,
                        restURL: restArray.website
                    }
                }
                restInfoArray.push(restObj);
                console.log(restInfoArray)
            });
        }
    }

    // $(document).on("click", ".btn-restaurant", populateRestInfo);
    $("#btn-addr").on("click", processAddr);
});
