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
 
            var rest = $("<div>");
            rest.addClass("row list restaurant");
 
            var button = $("<div>");
            button.addClass("col-xs-12 col-sm-12 col-md-12 btn btn-default btn-restaurant");            
            button.attr({
                'type':        'button',
                'id':          'item-' + i,
                'data-toggle': 'modal',
                'data-target': '#info-modal',
                'data-index' : i,
                'data-id'    : listArr[i].place_id
            });
            rest.append(button);
 
            var buttonRow = $("<div>").addClass("row");
            button.append(buttonRow);
 
            var restInfo = $("<div>")
            restInfo.addClass("col-xs-12 col-sm-12 col-md-8 rest-info");
            buttonRow.append(restInfo);
 
            var title = $("<p>");
            title.text(listArr[i].nameStr);
            restInfo.append(title);
 
            var timeInfo = $("<div>");
            timeInfo.addClass("col-xs-12 col-sm-12 col-md-4 time-info");
            buttonRow.append(timeInfo);
 
            var closeInfo = $("<div>");
            closeInfo.addClass("row close-info");
            timeInfo.append(closeInfo);
 
            var closeInfoCol = $("<div>");
            closeInfoCol.addClass("col-xs-12 col-sm-12 col-md-12");
            closeInfo.append(closeInfoCol);
 
            var closeInfoTxt = $("<h5>");
            (isOpen24Hrs)
                ? closeInfoTxt.text("Open 24 Hours")
                : closeInfoTxt.text("Closes at " + closeTimeStr);
            closeInfoCol.append(closeInfoTxt);
 
            var alertInfo = $("<div>");
            alertInfo.addClass("row");
            timeInfo.append(alertInfo);
 
            var alertInfoCol = $("<div>");
            alertInfoCol.addClass("col-xs-12 col-sm-12 col-md-12");
            alertInfo.append(alertInfoCol);
 
            if (sendAlert) {
                var alertInfoTxt = $("<h5>");
                (timeLeft > 0)
                    ? alertInfoTxt.text("Closes in less than " + timeLeft + " mins")
                    : alertInfoTxt.text("Closing soon!");
                alertInfoCol.append(alertInfoTxt);
            }
 
            container.append(rest);
            createMarkers(listArr[i].addressStr, listArr[i].nameStr);
        }
    })();
 }