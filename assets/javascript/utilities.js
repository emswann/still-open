/**
 * @file Utilities file for the Still Open application. File is reuseable and not application specific.
 * @author Robert Brown, Joshua Lewis, Elaina Swann
 * @version 1.0 
*/

/** 
 * @function delayProcess 
 * @description Sets a timeout based on time parameter.
 * @param {number} time - Time in milliseconds to set timeout.
 * @returns {number} Resolve function always returns true. No reject required.
*/
function delayProcess(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(1);
    }, time);
  });
}

/** 
 * @function divideArray 
 * @description Divides array into equal length chunks based on size parameter. Last array element will be <= size.
 * @param {array} array - Array to divide.
 * @param {number} size - Chunk size.
 * @returns {array} Original array divided into array chunks.
*/
function divideArray(array, size) {
  var tmpArray = [];
    
  for (let i= 0; i < array.length; i += size) {
    var chunk = array.slice(i, i+size);

    tmpArray.push(chunk);
  }

  return tmpArray;
}