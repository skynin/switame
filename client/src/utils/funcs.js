export const randomInt = (min, max) => {
  // https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

var tttID = 999
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
