function Restaurants(apiArray) {

  this.restaurantArray = (function() {

    function Restaurant(apiObj) {
      // Assumes always add because validated beforehand.
      this.nameStr         = apiObj.nameStr;
      this.addressStr      = apiObj.addressStr;
      this.hourOpenStr     = apiObj.hourOpenStr;
      this.hourClosedStr   = apiObj.hourClosedStr;
      this.daysOfWeekArray = apiObj.daysOfWeekArray;
      this.locationObj     = apiObj.locationObj;
      this.radiusNum       = apiObj.radiusNum;
      this.websiteStr      = apiObj.websiteStr;
    }

    return (function() {
      var restaurantArray = [];

      for (var i = 0; i < apiArray.length; i++) {
        var apiObj = apiArray[i];

        if (apiObj.isOpen) {
          var restaurantObj = new Restaurant(apiObj);
          restaurantArray.push(restaurantObj);
        }
      }

      // Need to sort by radius.

      return restaurantArray;
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

  return [isSuccess, this.restaurantArray];
}




