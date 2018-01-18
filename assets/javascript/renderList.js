$(document).ready(function () {
    var restaurantArr = [];
    var listCount = 0,
        currentRest = 0,
        container = $("#list-container"),
        time;

    function Restaurant(name, hours) {
        this.name = name;
        this.hours = hours
    }

    function createRestaurants(name, hours) {
        var rest = new Restaurant(name, hours);
        exampleArr.push(rest);
    }

    (function addRest() {
        for (let i = 0; i < 10; i++) {
            createRestaurants("New Rest: " + i, [{Monday: "7:00 AM – 22:00 PM"}, {Tuesday: "7:00 AM – 10:00 PM"}, {Wednesday: "7:00 AM – 10:00 PM"}, {Thursday: "7:00 AM – 10:00 PM"}, {Friday: "7:00 AM – 10:00 PM"}, {Saturday: "8:00 AM – 10:00 PM"}, {Sunday: "9:00 AM – 9:00 PM"}])
        }
        console.log(exampleArr);
    })();

    (function getTime() {
        time = new Date();
        hours = time.getHours();
        minutes = time.getMinutes();
        console.log(time)
    })();

    (function renderList() {
        for (let i = 0; i < exampleArr.length; i++) {
            var row = $("<div>");
            row.addClass("row list");

            var rest = $("<div>");
            rest.addClass("restaurant text-center");

            var dismiss = $("<button>");
            dismiss.attr("data-dismiss", currentRest);
            dismiss.addClass("btn btn-danger dismiss col-md-1");
            dismiss.append("X");

            var button = $("<div>");
            button.addClass("btn btn-default btn-restaurant col-md-11");
            button.attr("type", "button").attr("id", "item-" + listCount).attr("data-toggle", "modal").attr("data-target", "#info-modal");
            button.text(exampleArr[currentRest].name);

            rest.append(dismiss);
            rest.append(button);
            row.append(rest);
            container.append(row);
            ++currentRest;
            ++listCount;
        }
    })();
})