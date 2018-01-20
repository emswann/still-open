function renderList(apiArr) {
    const MAX_COUNT = 10;
    const TIMEFRAME = 120; // 2 hours or 120 mins.
    var container = $("#list-container"),
        listArr = apiArr.array();
    var nowMoment = moment();

    (function createList() {
        container.empty();

        for (let i = 0; i < listArr.length && i < MAX_COUNT; i++) {
            var {sendAlert, timeLeft, closeTimeStr, isOpen24Hrs} = 
                apiArr.isClosing(i, nowMoment, TIMEFRAME); 

            var row = $("<div>");
            row.addClass("row list");

            var rest = $("<div>");
            rest.addClass("restaurant text-center");

            var button = $("<div>");
            button.addClass("btn btn-default btn-restaurant col-xs-12 col-sm-12 col-md-8");            
            button.attr({
                'type':        'button',
                'id':          'item-' + i,
                'data-toggle': 'modal',
                'data-target': '#info-modal',
                'data-index' : i,
                'data-id'    : listArr[i].place_id
            });
            button.text(listArr[i].nameStr);

            var timeInfo = $("<div>");
            timeInfo.addClass("time-info col-xs-12 col-sm-12 col-md-4");

            var closeInfo = $("<div>");
            closeInfo.addClass("row");
            (isOpen24Hrs) 
                ? closeInfo.text("Open 24 Hours")
                : closeInfo.text("Closes at " + closeTimeStr);

            timeInfo.append(closeInfo);

            var alertInfo = $("<div>");
            alertInfo.addClass("row");
            if (sendAlert) {
                (timeLeft > 0) 
                    ? alertInfo.text("Closes in less than " + timeLeft + " mins")
                    : alertInfo.text("Closing soon!");
            }

            timeInfo.append(alertInfo);
            
            rest.append(button).append(timeInfo);
            row.append(rest);
            container.append(row);
            createMarkers(listArr[i].addressStr, listArr[i].nameStr);
        }
    })();
}