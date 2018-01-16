$(document).ready(function () {
    var map, location, marker, geocoder, service, infowindow;
    var restAPIArray = [];
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
        getRestaurants();
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

    var getRestaurants = function () {
        const MAX_RADIUS = 2000;

        // Use current location (global variable) to determine restaurant list.
        console.log("RL Latitude: " + location.lat());
        console.log("RL Longitude: " + location.lng());

        infowindow = new google.maps.InfoWindow();
        service.nearbySearch({
            location: {
                lat: location.lat(),
                lng: location.lng()
            },
            radius: MAX_RADIUS,
            type: ['restaurant']
        }, callback);

        function callback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                results.forEach(createRestAPIArr);
            }
            console.log('Restaurant API: ', restAPIArray);
            // restInfoArray = new Restaurants(restAPIArray);
            // console.log('Restaurant Info: ', restInfoArray);
        }

        function createRestAPIArr(place) {
            var request = {
                placeId: place.place_id
            };
            service.getDetails(request, function (details, status) {
                if (details !== null) {
                    restAPIArray.push(details)
                }
            });
        }
    }

    // $(document).on("click", ".btn-restaurant", populateRestInfo);
    $("#btn-addr").on("click", processAddr);
});
