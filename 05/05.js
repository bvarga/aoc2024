import { readFileSync } from "node:fs";

/** @type {string} */
const raw = readFileSync("05/input", "utf-8");

const [, rules, updates] = raw.split("\n").reduce((acc, row) => {
  if (row.trim() === "") {
    acc[0] = false;
  } else if (acc[0]) {
    const [lower, higher] = row.split("|").map(Number);
    acc[1].push([lower, higher]);
  } else {
    acc[2].push(row.split(",").map(Number));
  }
  return acc;
}, /** @type {[boolean, [number, number][], number[][]]} */ ([true, [], []]));

const part1 = updates
  .filter((update) => reorder(update, rules) === null)
  .reduce((acc, update) => acc + middle(update), 0);

console.log(`Part 1: ${part1}`);

const part2 = updates
  .reduce((acc, update) => {
    const reordered = reorder(update, rules);
    if (reordered) {
      acc.push(reordered);
    }
    return acc;
  }, /** @type {number[][]} */ ([]))
  .reduce((acc, update) => acc + middle(update), 0);

console.log(`Part 2: ${part2}`);

/**
 *
 * @param {number[]} update
 * @param {[number, number][]} rules
 * @returns {number[] | null}
 */
function reorder(update, rules) {
  const reordered = update.reduce((acc, _, indx, arr) => {
    let i = indx + 1;
    while (i < acc.length) {
      const wrong = rules.find(
        (rule) => rule[0] === acc[i] && rule[1] === acc[indx]
      );
      if (wrong) {
        if (acc === arr) {
          acc = [...arr];
        }
        const tmp = acc[indx];
        acc[indx] = acc[i];
        acc[i] = tmp;
        i = indx;
      }
      i++;
    }
    return acc;
  }, update);
  return reordered === update ? null : reordered;
}

/**
 *
 * @param {number[]} update
 * @returns {number}
 */
function middle(update) {
  return update[(update.length - 1) / 2];
}
