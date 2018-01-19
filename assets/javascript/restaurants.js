function Restaurants(apiArray) {
  this.restaurantArray = (() => {
    
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
      for (let i = 0; i < apiArray.length; i++) {
        restaurantArray.push(new Restaurant(apiArray[i]));
      }

      // Need to sort by radius.
      return restaurantArray;
    })(); 
  })();
}

Restaurants.prototype.array = () => {
  return this.restaurantArray;
}

Restaurants.prototype.get = index => {
  return (index < this.restaurantArray.length) 
    ? this.restaurantArray[index] 
    : undefined;
}

Restaurants.prototype.delete = index => {
  isSuccess = false;

  if (index < this.restaurantArray.length) {
    this.restaurantArray.splice(index, 1);
    isSuccess = true;
  }  

  return {status: isSuccess, element: this.restaurantArray};
}
