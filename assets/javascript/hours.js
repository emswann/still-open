function Hours(periodArray, weekdayTextArray) {

  this.hoursArray = (() => {
    
<<<<<<< HEAD
    var getDay = periodObj => {
        var dayNum = 0;

        (typeof(periodObj.close) === "undefined") 
          ? dayNum = periodObj.open.day 
          : dayNum = periodObj.close.day;

        return dayNum;
=======
    function DayOfWeek(periodObj, weekdayTextStr) {
      this.day   = periodObj.open.day; // Can pick either open/close. Same value.
      // this.open  = {time   : periodObj.open.time,
      //               hours  : periodObj.open.hours,
      //               minutes: periodObj.open.minutes};
      // this.close = {time   : periodObj.close.time,
      //               hours  : periodObj.close.hours,
      //               minutes: periodObj.close.minutes};
      // this.text  = weekdayTextStr
>>>>>>> master
    }
    
    function DayOfWeek(currDayIndex, periodObj, weekdayTextStr) {
      var addDefaultElement = function(day) {
        return {close:     {day: day,
                            time: "0000",
                            hours: 0,
                            minutes: 0},
                 open:     {day: day,
                            time: "0000",
                            hours: 0,
                            minutes: 0},
                 isDefault: true};
      }

      var checkFor24Hrs = text => {
        var regex = new RegExp(/open 24 hours/, 'gi');

        return regex.test(text);
      }

      var apiIndex;
      
      (typeof(periodObj) !== "undefined")
        ? apiIndex = getDay(periodObj)
        : apiIndex = 0;

      this.day         = currDayIndex;
      this.text        = weekdayTextStr;
      this.isOpen24Hrs = checkFor24Hrs(this.text);

      /* Do this first to determine if default element is required.
         1) Closed days
         2) 24 hour restaurants
         3) Fill end of day of week.
         NOTE: weekdayTxtStr is always populated for all days of the week either with hours, closed text or open 24 hours text. */
      ((currDayIndex < apiIndex) 
        || (typeof(periodObj) === "undefined") 
        || (this.isOpen24Hrs))
          ? tmpPeriodObj = addDefaultElement(currDayIndex)
          : tmpPeriodObj = periodObj;

      this.open        = {time   : tmpPeriodObj.open.time,
                          hours  : tmpPeriodObj.open.hours,
                          minutes: tmpPeriodObj.open.minutes};
      this.close       = {time   : tmpPeriodObj.close.time,
                          hours  : tmpPeriodObj.close.hours,
                          minutes: tmpPeriodObj.close.minutes};
      this.isDefault   = (typeof(tmpPeriodObj.isDefault) === "undefined")
                          ? false : true; // Set isDefault to true if !undefined.
    }

    return (() => {
      const PERIOD_SUNDAY = 0;
      const PERIOD_TO_WEEKDAY_MAP = [6, 0, 1, 2, 3, 4, 5]; // Array index is the period.

      var hoursArray = [];

      var currDayIndex = PERIOD_SUNDAY;
      /* Use periodArray as the driver. 0 = Sunday. 6 = Saturday. weekdayTxtArray starts at 0 = Monday, so need to adjust for values. */
      for (let i = PERIOD_SUNDAY; 
               currDayIndex < PERIOD_TO_WEEKDAY_MAP.length 
                 && i < periodArray.length; 
               i++) {

        var dayNum = getDay(periodArray[i]);  
        while (currDayIndex <= dayNum) {
          hoursArray.push(new DayOfWeek(currDayIndex,
                                        periodArray[i], 
                                        weekdayTextArray[PERIOD_TO_WEEKDAY_MAP[currDayIndex]]));
          currDayIndex++;
        }
      }

      /* Need to consider case where we run out of periodArray values and still have days of the week we need to process. Process these until end of the week. */
      while (currDayIndex < PERIOD_TO_WEEKDAY_MAP.length) {
        hoursArray.push(new DayOfWeek(currDayIndex,
                                      undefined, 
                                      weekdayTextArray[PERIOD_TO_WEEKDAY_MAP[currDayIndex]]));
        currDayIndex++;
      }

      // Need to sort by radius.
      return hoursArray;
    })(); 
  })();
}

Hours.prototype.array = function() {
  return this.hoursArray;
}

Hours.prototype.get = function(index) {
  return (index < this.hoursArray.length) 
    ? this.hoursArray[index] 
    : undefined;
}