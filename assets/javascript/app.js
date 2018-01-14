$(document).ready(function () {
    var map, location, marker;

    function GoogleMap(position) {
        location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

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
    }

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

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(GoogleMap, showError);
    } else {
        showError();
    }
    
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
        console.log(infoArray);

        var populateLabels = function () {
            for (var i = 0; i < 11; i++) {
                var labelId = $("#item-" + i);
                labelId.text(infoArray[i].restName)
            }
        }

        var populateModals = function () {
            for (var i = 0; i < infoArray.length; i++) {
                if (infoArray[i].restName === $(this).text()) {
                    $('.modal-body').empty();
                    var modalLine = $('<h3>').text(infoArray[i].restName)
                    $('.modal-body').append(modalLine);
                    modalLine = $('<h3>').text(infoArray[i].restLoc)
                    $('.modal-body').append(modalLine);
                    modalLine = $('<h3>').text(infoArray[i].restVen)
                    $('.modal-body').append(modalLine);
                    modalLine = $('<h3>').text(infoArray[i].restOpen)
                    $('.modal-body').append(modalLine);
                }
            }
        }

        var render = function () {
            populateLabels();
        }

        render();
        $(document).on("click", '[data-toggle="modal"]', populateModals);

    });
});
