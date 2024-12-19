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

const part1 = data.designs?.filter((it) => isPossible(it, "")).length;
console.log(`Part 1: ${part1}`);

/**
 * @param {string} design
 * @param {string} prev
 * @returns {boolean}
 */
function isPossible(design, prev = "") {
  if (design.length <= data.max && data.towels.includes(design)) {
    return true;
  }

  let i = data.max;

  while (i > 0) {
    const starting = design.substring(0, i);
    if (data.towels.includes(starting)) {
      if (prev !== "") {
        data.towels.push(prev + starting);
        data.max = Math.max(data.max, prev.length + starting.length);
      }
      if (isPossible(design.substring(i), prev + starting)) {
        return true;
      } else {
        i--;
      }
    } else {
      i--;
    }
  }
  return false;
}
