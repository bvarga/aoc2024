import { readFileSync } from "node:fs";
import { Map } from "../lib/map.js";

/** @type {string} */
const raw = readFileSync("20/input", "utf-8");

const map = new Map();
map.load(raw, (it) => it);

const path = [map.find((it) => it === "S")];
const end = map.find((it) => it === "E");

while (
  path[path.length - 1][0] !== end[0] ||
  path[path.length - 1][1] !== end[1]
) {
  const [x, y] = path[path.length - 1];
  const [px, py] = path[Math.max(path.length - 2, 0)];
  const next = [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
  ].filter(
    ([nx, ny]) =>
      (map.data(nx, ny) === "." || map.data(nx, ny) === "E") &&
      !(px === nx && py === ny)
  );

  if (next.length !== 1) {
    throw new Error(`No or multiple path found (${x},${y})`);
  } else {
    path.push(next[0]);
  }
}

// 285??
const radius = 20;
const atLeast = 100;
let part2 = 0;

path.forEach(([x, y], indx) => {
  console.log(`Checking (${x}, ${y}) ${indx}/${path.length}`);

  /** @type {[number, number]} */
  const cheatFrom = [x, y];
  const ends = neighbours(cheatFrom, radius, map).filter(
    ([ex, ey]) => ex !== x || ey !== y
  );

  // map.print((it, px, py) => {
  //   if (ends.find(([ex, ey]) => ex === px && ey === py)) {
  //     return "O";
  //   } else if (x === px && y === py) {
  //     return "X";
  //   } else return it;
  // });
  ends.forEach(([ex, ey]) => {
    const pix2Index = path.findIndex(([px, py]) => px === ex && py === ey);
    const save = pix2Index - indx - dist([x, y], [ex, ey]);
    if (save >= atLeast) {
      // console.log(
      //   `from (${x},${y}) to (${ex},${ey}) can save ${pix2Index - indx}`
      // );
      part2++;
    }
  });
});

console.log(`Part 2: ${part2}`);

/**
 *
 * @param {[number, number]} point
 * @param {number} radius
 * @param {Map<string>} map
 * @returns {[number, number][]}
 */
function neighbours(point, radius, map) {
  /** @type {[number, number][]} */
  const points = [];

  for (let x = point[0] - radius; x <= point[0] + radius; x++) {
    for (let y = point[1] - radius; y <= point[1] + radius; y++) {
      const pix = map.data(x, y);
      if (
        pix &&
        pix !== "#" &&
        !(x === point[0] && y === point[1]) &&
        dist(point, [x, y]) <= radius
      ) {
        points.push([x, y]);
      }
    }
  }

  return points;
}

function dist(p1, p2) {
  return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
}

// 4941573 too high
// 1876229 too high
// 3720838 too high
