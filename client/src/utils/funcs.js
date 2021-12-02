export const debounce = function(func, wait, immediate) {
  var timeout, result;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) result = func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) result = func.apply(context, args);
    return result;
  };
}

export const throttle = (func, timeFrame, delay) => {
  var lastTime = 0;
  return function (...args) {
      var now = new Date();
      if (now - lastTime >= timeFrame) {
          lastTime = now;
          setTimeout(() => func(...args), delay || 1) // в очередь
      }
  };
}

export const randomInt = (min, max) => {
  if (min == max) return min

  // https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; // Минимум и максимум включаются
}

var tttID = 99
export const tempid=(prefix)=>{
  return (prefix || '') + (++tttID);
}

export const nanoid=(t=21)=>{
  // https://github.com/ai/nanoid/
  let e="",
  r=crypto.getRandomValues(new Uint8Array(t));
  for(;t--;)
  {let n=63&r[t];
    e+=n<36?
    n.toString(36):
    n<62?
      (n-26).toString(36).toUpperCase():
      n<63?randomInt(0,9):randomInt(0,9) // "_":"-"
    }
  return e};