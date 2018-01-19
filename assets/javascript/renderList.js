function renderList(apiArr) {
    const ITEM_COUNT = 10;
    var container = $("#list-container"),
        listArr = apiArr.array();

    (function createList() {
        for (let i = 0; i < ITEM_COUNT; i++) {
            var row = $("<div>");
            row.addClass("row list");

            var rest = $("<div>");
            rest.addClass("restaurant text-center");

            var dismiss = $("<button>");
            dismiss.attr("data-dismiss", i);
            dismiss.addClass("btn btn-danger dismiss col-md-1");
            dismiss.append("X");

            var button = $("<div>");
            button.addClass("btn btn-default btn-restaurant col-md-11");
            button.attr("type", "button").attr("id", "item-" + i).attr("data-toggle", "modal").attr("data-target", "#info-modal");
            button.text(listArr[i].nameStr);

            rest.append(dismiss);
            rest.append(button);
            row.append(rest);
            container.append(row);
        }
    })();
}