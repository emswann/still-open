function renderList(apiArr) {
    const ITEM_COUNT = 10;
    var container = $("#list-container"),
        listArr = apiArr.array();

    (function createList() {
        container.empty();
        if (listArr.length > 10) {
            for (let i = 0; i < ITEM_COUNT; i++) {
                var row = $("<div>");
                row.addClass("row list");

                var rest = $("<div>");
                rest.addClass("restaurant text-center");

                var button = $("<div>");
                button.addClass("btn btn-default btn-restaurant col-xs-12 col-sm-12 col-md-12");
                button.attr("type", "button").attr("id", "item-" + i).attr("data-toggle", "modal").attr("data-target", "#info-modal");
                button.text(listArr[i].nameStr);

                rest.append(button);
                row.append(rest);
                container.append(row);
                createMarkers(listArr[i].addressStr, listArr[i].nameStr);
                // createMarkers(i);
            }
        } else {
            for (let i = 0; i < listArr.length; i++) {
                var row = $("<div>");
                row.addClass("row list");

                var rest = $("<div>");
                rest.addClass("restaurant text-center");


                var button = $("<div>");
                button.addClass("btn btn-default btn-restaurant col-xs-12 col-sm-12 col-md-12");
                button.attr("type", "button").attr("id", "item-" + i).attr("data-toggle", "modal").attr("data-target", "#info-modal");
                button.text(listArr[i].nameStr);
                rest.append(button);
                row.append(rest);
                container.append(row);
                createMarkers(listArr[i].addressStr, listArr[i].nameStr);
            }
        }
    })();
}