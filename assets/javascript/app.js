$(document).ready(function () {
    var map, location, marker, geocoder;
    var infoArray = [];

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

    var renderRestList = function() {

        // Use current location (global variable) to determine restaurant list.
        console.log("RL Latitude: " + location.lat());
        console.log("RL Longitude: " + location.lng());

        var queryURL = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?";

        const API_KEY = "Kgr239ubbiqdhS_iZKqYRUeLSSQB085HltHPbeeQoPb_TXjRrjhFRCn8YKQ9h9j6YSzfG7znnvTdGQPCykmGNMOpzX1vjGJ7NpTFXb0pka_jOXdgfQxvfwsfKCdaWnYx";

        const authHeader = {
        Authorization: "Bearer " + API_KEY
        };

        queryURL += $.param({
            term: 'restaurants',
            latitude: location.lat(),
            longitude: location.lng()
        });

        $.ajax({
            url: queryURL,
            method: 'GET',
            headers: authHeader,
        }).done(function (response) {

            var array = response.businesses;

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

            //pulls location info from API array
            var locationLoop = function (arg) {
                var locationArray = [];
                if (Array.isArray(array)) {
                    for (var m = 0; m < arg.length; m++) {
                        var element = arg[m];
                        locationArray.push(element);
                    }
                    return locationArray;
                }
            }

            //reads the is_closed data in the API array
            var isOpen = function (arg) {
                if (!arg) {
                    return "Open";
                } else {
                    return "Closed";
                }
            }

            var populateLabels = function () {
                for (var i = 0; i < 11; i++) {
                    var labelId = $("#item-" + i);
                    labelId.text(infoArray[i].restName)
                }
            }

            for (var i = 0; i < array.length; i++) {
                var restArray = array[i];
                var restObj = {
                    restName: restArray.name,
                    restVen: vendorLoop(restArray.categories),
                    restOpen: isOpen(restArray.is_closed),
                    restCost: restArray.price,
                    restLoc: locationLoop(restArray.location.display_address)
                }

                infoArray.push(restObj);
            }

            console.log("RL Info: ", infoArray);

            populateLabels();
        });
    }

    var populateRestInfo = function () {
        for (var i = 0; i < infoArray.length; i++) {
            if (infoArray[i].restName === $(this).text()) {
                $('#info-modal-body').empty();
                var modalLine = $('<h3>').text(infoArray[i].restName)
                $('#info-modal-body').append(modalLine);
                modalLine = $('<h3>').text(infoArray[i].restLoc)
                $('#info-modal-body').append(modalLine);
                modalLine = $('<h3>').text(infoArray[i].restVen)
                $('#info-modal-body').append(modalLine);
                modalLine = $('<h3>').text(infoArray[i].restOpen)
                $('#info-modal-body').append(modalLine);
            }
        }
    }

    $(document).on("click", ".btn-restaurant", populateRestInfo);
    $("#btn-addr").on("click", processAddr);
});
