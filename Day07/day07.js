console.log('-----Day 07-----');

const inputReader = require('../utils/readInput').readFileInput;
const baggageRules = inputReader('input', '\n', { skipEmptyLines: true });

// const baggageRules = 
// `light red bags contain 1 bright white bag, 2 muted yellow bags.
// dark orange bags contain 3 bright white bags, 4 muted yellow bags.
// bright white bags contain 1 shiny gold bag.
// muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
// shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
// dark olive bags contain 3 faded blue bags, 4 dotted black bags.
// vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
// faded blue bags contain no other bags.
// dotted black bags contain no other bags.`.split('\n');
console.log(baggageRules.length, 'line count');


// Create mapping
const regexMapParts = /(.*(?!bags))\sbags\scontain\s(.*)\./;
const regexInnerParts = /(no\sother\sbags|(\d+)\s([^,]*?)\sbags?)/g;
const origToDestMappings = new Map();
const destToOrigMappings = new Map();
baggageRules.forEach(rule => {
  const [ _full, container, origins ] = regexMapParts.exec(rule);
  const originMatches = [...origins.matchAll(regexInnerParts)];
  // DEST --> ORIGIN
  destToOrigMappings.set(container,
    originMatches[0][0].startsWith('no other bags')
      ? []
      : originMatches.map(match => { return { count: match[2], container: match[3] }; }));

  // ORIGIN --> DEST
  for (const [ _, __, count, name] of originMatches) {
    if (!name) continue;
    // ensure origin and destination are recognized locations
    if (!origToDestMappings.has(container)) origToDestMappings.set(container, []);
    if (!origToDestMappings.has(name)) origToDestMappings.set(name, []);
    // map the origin to the destination
    // destY bags contain X origin bags ==> origin --> [ dest1, ..., destY ]
    const mappings = origToDestMappings.get(name);
    mappings.push({ count, container });
    origToDestMappings.set(name, mappings);
  }
});
console.log(origToDestMappings.size, 'known bags');

// PART 1 - containers for "shiny gold"
console.log('Part 1 ----');
const containers = new Set();
let queue = origToDestMappings.get('shiny gold');
let item;
while (item = queue.shift()) {
  containers.add(item.container);
  queue = queue.concat(origToDestMappings.get(item.container));
}
console.log(containers.size, 'containers can ultimately hold the "shiny gold"');

// PART 2 - containers *inside* "shiny gold"
console.log('Part 2 ----');
function countBagsInside(name) {
  const contents = destToOrigMappings.get(name);
  if (!contents.length) {
    return 0;
  } else {
    return contents.reduce(
      (total, innerBag) => total + (countBagsInside(innerBag.container) + 1) * innerBag.count,
      0);
  }
}
console.log(countBagsInside('shiny gold'), 'bags inside "shiny gold"');
