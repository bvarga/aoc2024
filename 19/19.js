import { readFileSync } from "node:fs";

/** @type {string} */
const raw = readFileSync("19/input", "utf-8");

/** @typedef {{ towels: string[], max: number, designs: string[] | null }} Data */

const data = raw.split("\n").reduce(
  (acc, line) => {
    if (line === "") {
      acc.designs = [];
      return acc;
    }

    if (!acc.designs) {
      acc.towels = line.split(",").map((it) => {
        acc.max = Math.max(acc.max, it.length);
        return it.trim();
      });
    } else {
      acc.designs.push(line);
    }

    return acc;
  },
  /** @type {Data} */ ({
    towels: [],
    max: 0,
    designs: null,
  })
);

/** @type {Record<string, number>} */
const cache = {};

const results = data.designs.reduce(
  (acc, design) => {
    const count = process(design);
    acc.possible += count > 0 ? 1 : 0;
    acc.sum += count;
    return acc;
  },
  /** @type {{possible: number, sum: number}} */
  ({
    possible: 0,
    sum: 0,
  })
);

console.log(`Part 1: ${results.possible}`);
console.log(`Part 2: ${results.sum}`);

/**
 * @param {string} design
 * @returns {number}
 */
function process(design) {
  if (design.length === 0) {
    return 0;
  }

  if (cache[design]) {
    return cache[design];
  }

  let sum = 0;
  let i = 1;
  while (i < data.max && i <= design.length) {
    const starting = design.substring(0, i);
    if (data.towels.includes(starting)) {
      const remaining = design.substring(i);
      if (remaining === "") {
        sum++;
        i++;
        continue;
      }
      const sub = process(remaining);
      if (sub === 0) {
        // return 0;
      } else {
        sum += sub;
      }
    }
    i++;
  }
  cache[design] = sum;
  return sum;
}
