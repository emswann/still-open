function delayProcess() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(1);
    }, 5000);
  });
}

function divideArray(array, size) {
  var tmpArray = [];
    
  for (i= 0; i < array.length; i += size) {
    var chunk = array.slice(i, i+size);

    tmpArray.push(chunk);
  }

  return tmpArray;
}