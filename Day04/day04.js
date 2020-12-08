console.log('-----Day 04-----');

const inputReader = require('../utils/readInput').readFileInput;
const passportBatch = inputReader('input', '\n', { skipEmptyLines: false });

const passportPropertyRegex = /(byr|iyr|eyr|hgt|hcl|ecl|pid|cid):([^\s]+)/g;

class Passport {
  byr; iyr; eyr;
  hgt; hcl; ecl;
  pid; cid;

  validators = {
    'byr': val => val >= 1920 && val <= 2002,
    'iyr': val => val >= 2010 && val <= 2020,
    'eyr': val => val >= 2020 && val <= 2030,
    'hgt': val => {
      const m = /^(\d+)(cm|in)$/.exec(val);
      if (!m) return false;
      const num = parseInt(m[1]);
      if (m[2] === 'cm') return num >= 150 && num <= 193;
      else if (m[2] === 'in') return num >= 59 && num <= 76;
      else return false;
    },
    'hcl': val => /^\#[0-9a-f]{6}$/.test(val),
    'ecl': val => /^(amb|blu|brn|gry|grn|hzl|oth)$/.test(val),
    'pid': val => /^\d{9}$/.test(val),
    'cid': val => true
  }

  set(prop, value) {
    if (Object.keys(this).includes(prop)) {
      this[prop] = value;
    }
  }

  isValid(mode) {
    if (mode === 1) return this.byr && this.iyr && this.eyr &&
                           this.hgt && this.hcl && this.ecl && this.pid;
    if (mode === 2) {
      return this.byr && this.iyr && this.eyr &&
            this.hgt && this.hcl && this.ecl && this.pid &&
            Object.keys(this)
              .filter(k => k !== 'validators')
              .reduce((acc, key) => 
                acc && this.validators[key](this[key]),
                true);
    }
    return false;
  }
}

let passport = new Passport();
let validPassportCountPart1 = 0;
let validPassportCountPart2 = 0;
passportBatch.forEach((line, idx) => {
  const props = [...line.matchAll(passportPropertyRegex)];
  if (props.length) {
    props.forEach(match => {
      passport.set(match[1], match[2]);
    });
  } else {
    // new passport
    validPassportCountPart1 += passport.isValid(1) ? 1 : 0;
    validPassportCountPart2 += passport.isValid(2) ? 1 : 0;
    passport = new Passport();
  }
});
console.log('Valid passports:');
console.log('Part 1', validPassportCountPart1);
console.log('Part 2', validPassportCountPart2);
