import { readFileSync } from "node:fs";

/** @type {string} */
const raw = readFileSync("11/input", "utf-8");

let stones = raw.split(" ").reduce((acc, num) => {
  acc[num] = acc[num] || 0;
  acc[num] += 1;
  return acc;
}, /** @type {{ [key: string]: number }} */ ({}));

console.log("Part 1", calc(stones, 25));
console.log("Part 2", calc(stones, 75));

/**
 *
 * @param {string} str
 * @returns {string[]}
 */
export function trafo(str) {
  if (str === "0") {
    return ["1"];
  }

  if (str.length % 2 === 0) {
    const n1 = str.substring(0, str.length / 2);
    const n2 = str.substring(str.length / 2);
    return [n1, Number(n2).toString()];
  }

  return [(Number(str) * 2024).toString()];
}

/**
 *
 * @param {{ [key: string]: number }} stones
 * @param {number} iteration
 * @returns {number}
 */
function calc(stones, iteration) {
  for (let i = 0; i < iteration; i++) {
    stones = Object.keys(stones).reduce((acc, num) => {
      const count = stones[num];
      const newStones = trafo(num);

      newStones.forEach((stone) => {
        acc[stone] = acc[stone] || 0;
        acc[stone] += count;
      });
      return acc;
    }, /** @type {{ [key: string]: number }} */ ({}));
  }

  return Object.entries(stones).reduce((sum, [, count]) => {
    return sum + count;
  }, 0);
}
