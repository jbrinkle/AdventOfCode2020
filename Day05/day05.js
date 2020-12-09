console.log('-----Day 05-----');

const inputReader = require('../utils/readInput').readFileInput;
const boardingPasses = inputReader('input', '\n', { skipEmptyLines: true });

function getSeatId(boardingPass) {
  const reducer = (range, marker) => {
    const diff = range[1] - range[0], min = range[0], max = range[1];
    if (marker === 'F' || marker === 'L') range[1] = Math.floor(diff / 2) + min;
    if (marker === 'B' || marker === 'R') range[0] = Math.ceil(diff / 2) + min;
    return range[0] === range[1] ? range[0] : range;
  };
  const row = boardingPass.slice(0, 7).split('').reduce(reducer, [0, 127]);
  const col = boardingPass.slice(7, 10).split('').reduce(reducer, [0, 7]);

  return row * 8 + col;
}
let seatIdsFound = [];

// Part 1
const maxSeatId = boardingPasses.reduce((max, pass) => {
  const seatId = getSeatId(pass);
  seatIdsFound.push(parseInt(seatId));
  return seatId > max ? seatId : max;
}, 0);
console.log('Max seat id: ', maxSeatId);

// Part 2
seatIdsFound = seatIdsFound.sort((a, b) => a - b);
for (let i = 1; i < seatIdsFound.length; i++) {
  if (seatIdsFound[i] > seatIdsFound[i - 1] + 1) {
    console.log('My seat ID: ', seatIdsFound[i - 1] + 1);
  }
}
