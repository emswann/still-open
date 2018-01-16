function Hours(periodArray, weekdayTextArray) {
  this.hoursArray = (function() {
    
    function DayOfWeek(periodObj, weekdayTextStr) {
      this.day   = periodObj.open.day; // Can pick either open/close. Same value.
      this.open  = {time   : periodObj.open.time,
                    hours  : periodObj.open.hours,
                    minutes: periodObj.open.minutes};
      this.close = {time   : periodObj.close.time,
                    hours  : periodObj.close.hours,
                    minutes: periodObj.close.minutes};
      this.text  = weekdayTextStr
    }

    return (function() {
      var hoursArray = [];

      /* Use periodArray as the driver. 0 = Sunday. 6 = Saturday. weekdayTxtArray starts at 0 = Monday, so need to adjust for values. */
      for (let i = 0, j = 1; i < periodArray.length; i++, j++) {
        if (j === periodArray.length) {
          j = 0;
        }

        hoursArray.push(new Hour(periodArray[i], weekdayTextArray[j]));
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