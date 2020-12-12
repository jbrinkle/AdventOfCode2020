console.log('-----Day 08-----');

const inputReader = require('../utils/readInput').readFileInput;
const hhConsoleCode = inputReader('input', '\n', { skipEmptyLines: true });

const regexOp = /^(\w{3})\s([+-])(\d+)$/;

// Part 1 - Detecting infinite loop
let acc = 0;
let index = 0;
let copyOfCode = hhConsoleCode.map(line => line);
while (true) {
  const parsedLoC = regexOp.exec(copyOfCode[index]);
  if (!parsedLoC) {
    // loop detected!
    console.log('Loop detected! Acc value = ', acc);
    break;
  }

  // clear line of code for detection purposes
  copyOfCode[index] = '';

  const [ _, op, sign, value ] = parsedLoC;
  const signedVal = value * (sign === '-' ? -1 : 1);
  switch(op) {
    case 'nop':
      index++;
      break;
    case 'acc':
      acc += signedVal;
      index++;
      break;
    case 'jmp':
      index += signedVal
      break;
  }
}

// Part 2 - Fixing the corruption
acc = 0;
index = 0;
copyOfCode = hhConsoleCode
// `nop +0
// acc +1
// jmp +4
// acc +3
// jmp -3
// acc -99
// acc +1
// jmp -4
// acc +6`.split('\n')
  .map((line, idx) => {
  const [ _, op, sign, value ] = regexOp.exec(line);
  const signedVal = value * (sign === '-' ? -1 : 1);
  return {
    op,
    signedVal,
    index: idx,
    alt: false,
    visited: false
  }});
const stack = [];
let alt = 0;
// (index = stack.pop()) !== copyOfCode.length
while (index !== copyOfCode.length) {
  let op = copyOfCode[index];

  if (op.visited) {
    // loop detected - undo stack until we can find an alt path
    let keepPopping = true;
    while (keepPopping) {
      let popped = stack.pop();
      if (popped === undefined) throw 'Tried all paths and failed';

      popped.visited = false;
      index = popped.index;
      keepPopping =
        popped.op === 'acc' || // no substitutions for acc
        popped.alt ||          // already tried alt path
        alt > 0;               // can't try an alt path because only 1 sub can be made
      if (keepPopping && popped.alt) {
        popped.alt = false; // maybe try again later in different path
        alt--;
      } else if (!keepPopping) {
        popped.alt = true; // try alt path on this round
        alt++;
        if (alt > 1) throw 'bad!';
        op = popped;
      }
    }
  }

  stack.push(op);
  op.visited = true;

  index += (op.op === 'acc'
            || (op.op === 'nop' && !op.alt)
            || (op.op === 'jmp' && op.alt))
      ? 1
      : op.signedVal;
}
console.log('Acc value', stack.filter(c => c.op === 'acc').reduce((acc, c) => acc + c.signedVal, 0));
