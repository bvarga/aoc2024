import { readFileSync } from "node:fs";

/** @type {string} */
const raw = readFileSync("07/input", "utf-8");

const data = raw
  .split("\n")
  .filter(Boolean)
  .map((it) => {
    const line = it.split(":");
    return {
      result: Number(line[0].trim()),
      inputs: line[1].trim().split(" ").map(Number),
    };
  });

const sum = data
  .filter((it) => check(it, ["+", "*"]))
  .reduce((acc, it) => acc + it.result, 0);
console.log(`Part 1: ${sum}`);

const sum2 = data
  .filter((it) => check(it, ["+", "*", "||"]))
  .reduce((acc, it) => acc + it.result, 0);
console.log(`Part 2: ${sum2}`);

/**
 * @param {{ result: number, inputs: number[]}} row
 * @param {string[]} operators
 * @returns {boolean}
 */
function check(row, operators) {
  const ops = build(row, 1, row.inputs[0], [], operators);
  // console.log("ops for row", row, ops);
  return ops !== null;
}

/**
 *
 * @param {{ result: number, inputs: number[]}} row
 * @param {number} index
 * @param {number} partial
 * @param {string[]} ops
 * @param {string[]} operators
 * @returns {string[] | null}
 */
function build(row, index, partial, ops, operators) {
  if (partial > row.result) {
    return null;
  }

  if (index >= row.inputs.length) {
    return row.result === partial ? ops : null;
  }

  return (
    (operators.includes("+")
      ? build(
          row,
          index + 1,
          partial + row.inputs[index],
          [...ops, "+"],
          operators
        )
      : null) ||
    (operators.includes("*")
      ? build(
          row,
          index + 1,
          partial * row.inputs[index],
          [...ops, "*"],
          operators
        )
      : null) ||
    (operators.includes("||")
      ? build(
          row,
          index + 1,
          Number(partial.toString() + row.inputs[index].toString()),
          [...ops, "||"],
          operators
        )
      : null)
  );
}
