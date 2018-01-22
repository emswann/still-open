function delayProcess(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(1);
    }, time);
  });
}

function divideArray(array, size) {
  var tmpArray = [];
    
  for (let i= 0; i < array.length; i += size) {
    var chunk = array.slice(i, i+size);

    tmpArray.push(chunk);
  }

  return tmpArray;
}