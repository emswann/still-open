function renderList(apiArr) {
  const MAX_COUNT = 10;
  const TIMEFRAME = 120; // 2 hours or 120 mins.

  var container   = $('#list-container');
  var listArr     = apiArr.array();

  var textStr     = '';

  var nowMoment = moment();

  (function createList() {
    container.empty();

    if (listArr.length > 0) {
      $('#no-rest-message').detach();

      for (let i = 0; i < listArr.length && i < MAX_COUNT; i++) {
        var {sendAlert, timeLeft, closeTimeStr, isOpen24Hrs} =
          apiArr.isClosing(i, nowMoment, TIMEFRAME);
 
        var rest = $('<div>')
          .addClass('row list restaurant');
 
        var button = $('<div>')
          .addClass('col-xs-12 col-sm-12 col-md-12 btn btn-default btn-restaurant')
          .attr({
            'type':        'button',
            'id':          'item-' + i,
            'data-toggle': 'modal',
            'data-target': '#info-modal',
            'data-index' : i,
            'data-id'    : listArr[i].place_id
          });
        rest.append(button);
 
        var buttonRow = $('<div>')
          .addClass("row");
        button.append(buttonRow);
 
        var restInfo = $('<div>')
          .addClass('col-xs-12 col-sm-12 col-md-8 rest-info');
        buttonRow.append(restInfo);
 
        var title = $('<p>')
          .text(listArr[i].nameStr);
        restInfo.append(title);
 
        var timeInfo = $('<div>')
          .addClass('col-xs-12 col-sm-12 col-md-4 time-info');
        buttonRow.append(timeInfo);
 
        var closeInfo = $('<div>')
          .addClass('row close-info');
        timeInfo.append(closeInfo);
 
        var closeInfoCol = $('<div>')
          .addClass('col-xs-12 col-sm-12 col-md-12');
        closeInfo.append(closeInfoCol);
 
        var closeInfoTxt = $('<h5>');
        textStr = (isOpen24Hrs) ? 'Open 24 Hours' : 'Closes at ' + closeTimeStr;
        closeInfoTxt.text(textStr);
        closeInfoCol.append(closeInfoTxt);
 
        var alertInfo = $('<div>')
          .addClass("row");
        timeInfo.append(alertInfo);
 
        var alertInfoCol = $('<div>')
          .addClass('col-xs-12 col-sm-12 col-md-12');
        alertInfo.append(alertInfoCol);
 
        if (sendAlert) {
          var alertInfoTxt = $('<h5>');
          textStr = (timeLeft > 0)
            ? ('Closes in less than ' + timeLeft + ' mins')
            : ('Closing soon!');
          alertInfoTxt.text(textStr);
          alertInfoCol.append(alertInfoTxt);
        }
 
        container.append(rest);
        createMarkers(listArr[i].addressStr, listArr[i].nameStr);
      }
    }
    else {
      var messageDiv = $('<p>')
                         .addClass('row')
                         .attr('id', 'no-rest-message')
                         .text('No restaurants are open within the search area');
      container.append(messageDiv);
    }
  })();
}