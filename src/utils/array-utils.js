export function removeDuplicates(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

export function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
