function Restaurants(searchAPIArray, detailAPIArray) {
  this.restaurantArray = (() => {

    var sortArray = (refArray, sortArray) => {
      sortedArray = [];

      if (refArray.length === sortArray.length) {
        refArray.forEach(refPlace => {
          sortArray.forEach(sortPlace => {
            if (refPlace.place_id === sortPlace.place_id) {
              sortedArray.push(sortPlace);
            }
          })
        })
      }
      else {
        sortedArray = sortArray;
        console.log('Restaurants: API search array does not match length of details array...bypassing sorting.');
      }

      return sortedArray;
    }
    
    function Restaurant(apiObj) {

      var formatCost = costNum => {
        var costStr = '';

        switch (costNum) {
          case 0: 
            costStr = 'Free';
            break;
          case 1:
          case 2:
          case 3:
          case 4:
            for (let i = 0; i < costNum; i++) {
              costStr += '$';
            }
            break;
          default:
            costStr = 'No pricing info';
        }

        return costStr;
      }

      var formatHours = (periodArray, weekdayTextArray) => {
        return new Hours(periodArray, weekdayTextArray);
      }

      // Assumes always add because validated beforehand.
      this.place_id        = apiObj.place_id;
      this.locationObj     = apiObj.geometry.location;
      this.nameStr         = apiObj.name;
      this.addressStr      = apiObj.formatted_address;
      this.phoneStr        = apiObj.formatted_phone_number; 
      this.hoursObj        = formatHours(apiObj.opening_hours.periods,
                                         apiObj.opening_hours.weekday_text);
      this.cost            = formatCost(apiObj.price_level);
      this.websiteStr      = apiObj.website;
    }

    return (() => {
      var restaurantArray = [];

      /* Need to preserve the sorted order of the array with for vs. forEach. Constructor assumes all objects are added to restaurant array: list has already been scrubbed for null/undefined or permanently closed restaurants. */
      detailAPIArray.forEach(place => 
        restaurantArray.push(new Restaurant(place))
      );

      /* Need to sort by order of original sort array, since order may have changed due to async processing. */
      return sortArray(searchAPIArray, restaurantArray);
    })(); 
  })();
}

Restaurants.prototype.array = function() {
  return this.restaurantArray;
}

Restaurants.prototype.get = function(index) {
  return (index < this.restaurantArray.length) 
    ? this.restaurantArray[index] 
    : undefined;
}

Restaurants.prototype.delete = function(index) {
  isSuccess = false;

  if (index < this.restaurantArray.length) {
    this.restaurantArray.splice(index, 1);
    isSuccess = true;
  }  

  return {status: isSuccess, element: this.restaurantArray};
}

Restaurants.prototype.isClosing = function (index, currTime, timeFrame) {
  var checkForUserCrossover = (currTime, openTime) => {
    return (currTime.isBefore(openTime)) ? true : false;
  }

  var setTimes = (currTime, hoursInfo) => {
    return ({openTime:  moment().set({'year':        currTime.year(),
                                      'month':       currTime.month(),
                                      'date':        currTime.date(),
                                      'hour':        hoursInfo.open.hours,
                                      'minute':      hoursInfo.open.minutes,
                                      'second':      0,
                                      'millisecond': 0
                                     }),
             closeTime: moment().set({'year':        currTime.year(),
                                      'month':       currTime.month(),
                                      'date':        currTime.date(),
                                      'hour':        hoursInfo.close.hours,
                                      'minute':      hoursInfo.close.minutes,
                                      'second':      0,
                                      'millisecond': 0
                                     })
    });
  }

  const INTERVAL = 15;
  const CLOSE_TEXT_POS = -8;
  const OPEN_24_HRS_STR = 'Open 24 hours';

  var sendAlert    = false;
  var timeLeft     = 0;
  var closeTimeStr = '';

  var timeObj;

  var dayOfWeek   = currTime.day();

  var hoursInfo  = this.restaurantArray[index].hoursObj.hoursArray[dayOfWeek];

  if (!hoursInfo.isOpen24Hrs) { 
    timeObj = setTimes(currTime, hoursInfo);

    /* If user has crossed over, then need to revert to previous day information. */
    if (checkForUserCrossover(currTime, timeObj.openTime)) {
      // Cloning so we do not mutate/change current time.
      var prevTime = moment(currTime).subtract(1, 'd');
      var prevDayOfWeek = prevTime.day(); 

      var prevHoursInfo  = this.restaurantArray[index].hoursObj.hoursArray[prevDayOfWeek];

      /* Reload the time data with the previous day information and reset. */
      timeObj = setTimes(prevTime, prevHoursInfo);
    }
    
    /* This will work any time the day is a crossover (user time is in the same day or next day) because we have adjusted to the previous day earlier. NOTE: This step must follow the check for isUserCrossover because we need either the current or previous day data. */
    if (hoursInfo.isCrossover) {
      timeObj.closeTime.add(1, 'd');
    }

    // Cloning so we do not mutate/change current time.
    if (moment(currTime).add(timeFrame, 'm').isAfter(timeObj.closeTime)) {
      sendAlert = true;
      timeLeft = 
        Math.ceil(timeObj.closeTime.diff(currTime, 'm') / INTERVAL) * INTERVAL;
    }

    var closeTimeTxt = hoursInfo.text;
    closeTimeStr = closeTimeTxt.substr(CLOSE_TEXT_POS).trim();
  }
  else {
    // sendAlert is already set to false.
    closeTimeStr = OPEN_24_HRS_STR;
  }
 
  return ({'sendAlert':    sendAlert,
           'timeLeft':     timeLeft,
           'closeTimeStr': closeTimeStr,
           'isOpen24Hrs':  hoursInfo.isOpen24Hrs
          });
}