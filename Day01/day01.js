console.log('-----Day 01-----');

const inputReader = require('../utils/readInput').readFileInput;
const expenseReport = inputReader('input', '\n', true);

// part 1 - two numbers
console.log(' Part 1');
expenseReport.forEach((val, i, expenseReport) => {
    expenseReport.slice(i + 1).forEach(nextVal => {
        if (val + nextVal === 2020) {
            console.log(val, nextVal, val * nextVal);
        }
    });
});

// part 2 - three numbers
console.log(' Part 2');
expenseReport.forEach((x, i) => {
    expenseReport.slice(i + 1).forEach((y, j) => {
        expenseReport.slice(i + j + 1).forEach((z, k) => {
            if (x + y + z === 2020) {
                console.log(x, y, z, x * y * z);
            }
        });
    });
});

