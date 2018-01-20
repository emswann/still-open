function renderList(apiArr) {
    const MAX_COUNT = 10;
    var container = $("#list-container"),
        listArr = apiArr.array();

    (function createList() {
        container.empty();

        for (let i = 0; i < listArr.length && i < MAX_COUNT; i++) {
            var row = $("<div>");
            row.addClass("row list");

            var rest = $("<div>");
            rest.addClass("restaurant text-center");

            var button = $("<div>");
            button.addClass("btn btn-default btn-restaurant col-xs-12 col-sm-12 col-md-12");            
            button.attr({
                'type':        'button',
                'id':          'item-' + i,
                'data-toggle': 'modal',
                'data-target': '#info-modal',
                'data-index' : i,
                'data-id'    : listArr[i].place_id
            });
            button.text(listArr[i].nameStr);

            rest.append(button);
            row.append(rest);
            container.append(row);
            createMarkers(listArr[i].addressStr, listArr[i].nameStr);
        }
    })();
}