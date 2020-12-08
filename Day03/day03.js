console.log('-----Day 03-----');

const inputReader = require('../utils/readInput').readFileInput;
const treemap = inputReader('input', '\n', {});

/*
Personal Example with slope = 3
....##..#........##...#.#..#.##
.#.X..#....##....#...#..##.....
##.#..X#..#...#..........##.#..
.#.##.###X..#......###.........
#.#.#.......O...#.....#...#....
#.......#....#.X.##..###..##..#
.#...#...##....#..O......#.....
..........##.#.#.....X....#.#..
.......##..##...#.#.#...X......
.#.#.#...#...##...#.##.##..X...
........##.#.#.###.........##.O
#.X..#.#.#.....#...#...#......#
.#.#.X...##......#...#.........
*/

function getTrajectoryAnalyzer(xshift, yshift) {
  return (accStats, rowData, index) => {

    if (index % yshift !== 0) return accStats;

    // rowData repeats "infinitely" to right
    // next pos can exceed length of rowData so must calculate modified pos in rowData
    // rowData len 10 ..._.._.._  .._.._.._.  ._.._
    // pos 12 --> mod Pos = 2
    // pos 24 --> mod Pos = 4
    const pos = index * xshift;
    const modPos = pos < rowData.length ? pos : pos % rowData.length;
  
    // let copy = JSON.parse(JSON.stringify(rowData)).split('');
    // if (copy[modPos] === '.') copy.splice(modPos, 1, 'O');
    // if (copy[modPos] === '#') copy.splice(modPos, 1, 'X');
    // console.log(copy.join(''));
    
    accStats.open += (rowData.charAt(modPos) === '.' ? 1 : 0);
    accStats.tree += (rowData.charAt(modPos) === '#' ? 1 : 0);
    return accStats;
  };
}

// part 1 - toboggan trajectory
const analyzer = getTrajectoryAnalyzer(3, 1);
const trajectoryAnalysis = treemap.reduce(analyzer, { open: 0, tree: 0 });
console.log(trajectoryAnalysis);

// part 2 - multiple trajectory analysis
const slopes = [
  {x: 1, y: 1},
  {x: 3, y: 1},
  {x: 5, y: 1},
  {x: 7, y: 1},
  {x: .5, y: 2},
];
const product = slopes.reduce((accProduct, slope) => {
  const analyzer = getTrajectoryAnalyzer(slope.x, slope.y);
  const trajectoryAnalysis = treemap.reduce(analyzer, { open: 0, tree: 0 });

  const newProduct = accProduct * trajectoryAnalysis.tree;

  console.log(slope, '-->', trajectoryAnalysis, newProduct);
  return newProduct;
}, 1);
