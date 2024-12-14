import { readFileSync } from "node:fs";
import { Statement } from "../lib/machine.js";

/** @type {string} */
const raw = readFileSync("03/input", "utf-8");

/** @type {string[] | null} */
const muls = raw.match(/(mul\(\d+,\d+\))/g);

/**
 *
 * @param {number[]} inp
 * @returns {number}
 */
function mul(inp) {
  return inp.reduce((acc, it) => acc * it);
}

const sum = (muls ?? []).reduce(
  (acc, it) => acc + mul(Statement.getParametersAsNumbers(it)),
  0
);
console.log("Part 1", sum);

/** @type {string[] | null} */
const muls2 = raw.match(/(mul\(\d+,\d+\)|do\(\)|don't\(\))/g);

const sum2 = (muls2 ?? []).reduce(
  (acc, it) => {
    if (it === "do()") {
      return { enabled: true, sum: acc.sum };
    }

    if (it === `don't()`) {
      return { enabled: false, sum: acc.sum };
    }

    return {
      enabled: acc.enabled,
      sum: acc.enabled
        ? acc.sum + mul(Statement.getParametersAsNumbers(it))
        : acc.sum,
    };
  },
  { enabled: true, sum: 0 }
);

console.log("Part 2", sum2);
