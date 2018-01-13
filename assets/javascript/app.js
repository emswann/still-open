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

    var venLoop = function (arg) {
        var venArray = [];
        if (Array.isArray(array)) {
            for (var n = 0; n < arg.length; n++) {
                var element = arg[n].title;
                venArray.push(element);
            }
            return venArray;
        }
    }

    var locLoop = function (arg) {
        var locArray = [];
        if (Array.isArray(array)) {
            for (var m = 0; m < arg.length; m++) {
                var element = arg[m];
                locArray.push(element);
            }
            return locArray;
        }
    }

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
            restVen: venLoop(restArray.categories),
            restOpen: isOpen(restArray.is_closed),
            restCost: restArray.price,
            restLoc: locLoop(restArray.location.display_address)
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
    populateLabels();

});