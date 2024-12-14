import { readFileSync } from "node:fs";
import { Map } from "../lib/map.js";

/** @type {string} */
const raw = readFileSync("04/input", "utf-8");

const map = new Map();
map.load(raw);

const c = Array.from({length: map.size.x}, (_, x) => x).reduce((sum, x) => {
  return sum + Array.from({length: map.size.x}, (_, y) => y).reduce((sum2, y) => {
    return sum2 + XMAS(x, y);
  }, 0)
}, 0);

let count = 0;
for (let x = 0; x < map.size.x; x++) {
  for (let y = 0; y < map.size.y; y++) {
    count += XMAS(x, y);
  }
}

console.log(`Part 1: ${c}`);

let count2 = 0;
for (let x = 0; x < map.size.x; x++) {
  for (let y = 0; y < map.size.y; y++) {
    count2 += X_MAS(x, y);
  }
}

console.log(`Part 2: ${count2}`);

/**
 *
 * @param {number} x
 * @param {number} y
 */
function XMAS(x, y) {
  const str = "XMAS";
  let count = 0;

  [-1,0,1]
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) {
        continue;
      }
      let indx = 0;
      let ddx = 0;
      let ddy = 0;
      while (indx < str.length && map.data(x + ddx, y + ddy) === str[indx]) {
        indx += 1;
        ddx += dx;
        ddy += dy;
      }
      count += indx === str.length ? 1 : 0;
    }
  }
  return count;
}

/**
 *
 * @param {number} x
 * @param {number} y
 */
function X_MAS(x, y) {
  return map.data(x, y) === "A" &&
    ((map.data(x - 1, y - 1) === "M" && map.data(x + 1, y + 1) === "S") ||
      (map.data(x - 1, y - 1) === "S" && map.data(x + 1, y + 1) === "M")) &&
    ((map.data(x + 1, y - 1) === "M" && map.data(x - 1, y + 1) === "S") ||
      (map.data(x + 1, y - 1) === "S" && map.data(x - 1, y + 1) === "M"))
    ? 1
    : 0;
}
