console.log('-----Day 02-----');

const inputReader = require('../utils/readInput').readFileInput;
const passwordFile = inputReader('input', '\n', { skipEmptyLines: true });

const pwdRegex = /(\d+)\-(\d+)\s+(\w)\:\s+(\w+)/;

function getValidatePasswordsReduce(strategy) {
  return (accValidCount, entry) => {
    const parts = pwdRegex.exec(entry);
    if (!parts) return validCount;

    const n = parseInt(parts[1]);
    const m = parseInt(parts[2]);
    const char = parts[3];
    const pwd = parts[4];

    if (strategy === 'sled') {
      // part 1 strategy was the old "sled rental password policy"
      const letterCnts = pwd.split('').reduce(
        (count, letter) => letter === char ? count + 1 : count,
        0);
      
      return letterCnts >= n && letterCnts <= m ? accValidCount + 1 : accValidCount;
    } else if (strategy === 'toboggan') {
      // part 2 strategy was the "toboggan rental password policy"
      // subtract 1 because "no concept of index zero"
      const pos1 = pwd.charAt(n - 1) === char ? 1 : 0;
      const pos2 = pwd.charAt(m - 1) === char ? 1 : 0;

      return pos1 ^ pos2 ? accValidCount + 1 : accValidCount;
    } else {
      return 0;
    }
  }
}
let validPwds = 0;

// part 1 - password validation
console.log(' Part 1');
validPwds = passwordFile.reduce(getValidatePasswordsReduce('sled'), 0);
console.log(`Valid password count: ${validPwds}`);

// part 2 - "correct" password validation
console.log(' Part 2');
validPwds = passwordFile.reduce(getValidatePasswordsReduce('toboggan'), 0);
console.log(`Valid password count: ${validPwds}`);
