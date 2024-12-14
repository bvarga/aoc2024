import { readFileSync } from "node:fs";
import { Map } from "../lib/map.js";

/** @type {string} */
const raw = readFileSync("12/input", "utf-8");

/**
 * A number, or a string containing a number.
 * @typedef {{plant: string; area: number, perimiter: number, borders: { x1: number, y1: number, x2: number, y2: number}[] }} Region
 */

const regions = [];
const map = new Map();
map.load(raw, (it) => {
  return { plant: it, done: false, region: null };
});

for (let x = 0; x < map.size.x; x++) {
  for (let y = 0; y < map.size.y; y++) {
    const pixel = map.data(x, y);
    if (!pixel.done) {
      pixel.region = {
        plant: pixel.plant,
        area: 1,
        perimiter: 0,
        borders: [],
      };

      regions.push(pixel.region);
      calc(x, y, map, pixel.region);
    }
  }
}

// console.log(JSON.stringify(regions, null, 2));
console.log(
  `Part 1: ${regions.reduce((acc, it) => acc + it.area * it.perimiter, 0)}`
);

console.log(
  `Part 2: ${regions.reduce((acc, it) => acc + it.area * calcSides(it), 0)}`
);

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {Map<{plant: string, done: boolean, region: Region}>} map
 * @param {Region} region
 */
function calc(x, y, map, region) {
  const center = map.data(x, y);
  if (!center) {
    throw new Error("No center");
  }
  center.done = true;
  const neighbours = [
    {
      dx: 0,
      dy: -1,
    },
    {
      dx: 1,
      dy: 0,
    },
    {
      dx: 0,
      dy: 1,
    },
    {
      dx: -1,
      dy: 0,
    },
  ];
  neighbours.forEach((dir) => {
    const nx = x + dir.dx;
    const ny = y + dir.dy;
    const pixel = map.data(nx, ny);
    if (pixel?.plant === center?.plant) {
      if (pixel.done) {
        return;
      }
      region.area++;
      pixel.region = region;
      calc(nx, ny, map, region);
    } else {
      region.perimiter++;
      region.borders.push({
        x1: x,
        y1: y,
        x2: nx,
        y2: ny,
      });
    }
  });
}

/**
 *
 * @param {Region} region
 * @returns {number}
 */
function calcSides(region) {
  let result = 0;
  while (region.borders.length > 0) {
    const b = region.borders.pop();
    let indx = 0;
    const sides = [b];

    while (indx < region.borders.length) {
      const border = region.borders[indx];
      if (sides.find((it) => isNext(it, border) && !isDiag(it, border, region.plant))) {
        sides.push(border);
        region.borders.splice(indx, 1);
        indx = 0;
      } else {
        indx++;
      }
    }
    result++;
  }

  return result;
}

/**
 *
 * @param {{ x1: number, y1: number, x2: number, y2: number }} b1
 * @param {{ x1: number, y1: number, x2: number, y2: number }} b2
 * @returns {boolean}
 */
export function isNext(b1, b2) {
  const dist =
    distance(b1.x1, b1.y1, b2.x1, b2.y1) +
    distance(b1.x2, b1.y2, b2.x2, b2.y2) +
    distance(b1.x1, b1.y1, b2.x2, b2.y2) +
    distance(b1.x2, b1.y2, b2.x1, b2.y1);
  return dist === 6;
}
// ABCD
// EFGH
// IJKL


export function isDiag(b1, b2, plant) {
  const topLeft = {
    x: Math.min(b1.x1, b1.x2, b2.x1, b2.x2),
    y: Math.min(b1.y1, b1.y2, b2.y1, b2.y2)
  }
  const topRight = {
    x: Math.max(b1.x1, b1.x2, b2.x1, b2.x2),
    y: Math.min(b1.y1, b1.y2, b2.y1, b2.y2)
  }
  const bottomLeft = {
    x: Math.min(b1.x1, b1.x2, b2.x1, b2.x2),
    y: Math.max(b1.y1, b1.y2, b2.y1, b2.y2)
  }
  const bottomRight = {
    x: Math.max(b1.x1, b1.x2, b2.x1, b2.x2),
    y: Math.max(b1.y1, b1.y2, b2.y1, b2.y2)
  }
  
  return (plant === map.data(topLeft.x, topLeft.y)?.plant && plant === map.data(bottomRight.x, bottomRight.y)?.plant) ||
    (plant === map.data(topRight.x, topRight.y)?.plant && plant === map.data(bottomLeft.x, bottomLeft.y)?.plant);

}
/**
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
function distance(x1, y1, x2, y2) {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

// 853208 is too low
