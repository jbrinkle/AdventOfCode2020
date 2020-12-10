console.log('-----Day 06-----');

const inputReader = require('../utils/readInput').readFileInput;
const customsForms = inputReader('input', '\n', { skipEmptyLines: false });

// PART 1 - Summing unique "yes" answers among all groups
let travelGroupQs = [];
const sum1 = customsForms.reduce((sum, form) => {
  if (form.length) {
    travelGroupQs = form.split('').reduce((modified, question) => {
      if (modified.includes(question)) return modified;
      else return modified.concat(question);
    }, travelGroupQs);
  } else {
    sum += travelGroupQs.length;
    travelGroupQs = [];
  }
  return sum;
}, 0);
console.log(sum1);

// PART 2 - Summing group-wide "yes" answers among all groups
travelGroupQs = null;
const sum2 = customsForms.reduce((sum, form) => {
  if (form.length && !travelGroupQs) {
    travelGroupQs = form.split('');
  } else if (form.length && travelGroupQs) {
    const formQs = form.split('');
    travelGroupQs = travelGroupQs
      .filter(q => formQs.includes(q))
  } else {
    sum += travelGroupQs.length;
    travelGroupQs = null;
  }
  return sum;
}, 0);
console.log(sum2);
