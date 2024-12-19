import { readFileSync } from "node:fs";
import { Comp } from "./comp.js";
/** @type {string} */
const raw = readFileSync("17/input", "utf-8");

const comp = new Comp(false);
comp.load(raw);
const prg = comp.program.join(",");

//comp.print();
//comp.regA = 8n ** 15n
comp.run();
console.log(`Part 1: ${comp.outp()} `);

// const num8 = comp.program.reverse().join("");
// console.log("num8: ", num8);

// for (let i = 0; i < 8; i++) {
//   for (let j = 0; j < 8; j++) {
//     console.log(`${i} XOR ${j} = ${i ^ j}`);
//   }
// }
let min = 0n;

let values = new Set([""]);
while (values.size > 0) {
  console.log("Values: ", values.size);
  /** @type {Set<string>} */
  let next = new Set();
  values.forEach((value) => {
    next = new Set([...next, ...iterate(value, comp)]);
  });
  values = next;
}

/**
 *
 * @param {string} value
 * @param {Comp} comp
 * @returns {Set<string>}
 */
function iterate(value, comp) {
  const next = new Set();
  for (let i = 1; i < 2 ** 12; i++) {
    const bits = i.toString(2);
    const bin = `${bits}${value}`;

    if (bin.length > 3 * 16) {
      continue;
    }
    const regA = BigInt(`0b${bin}`);
    comp.clear();
    comp.regA = regA;
    comp.run();
    // console.log(`Checking: ${bin} -> ${comp.outp()}`);
    if (comp.outp() === prg) {
      console.log("Found value: ", regA);
      if (regA < min || min === 0n) {
        min = regA;
        console.log(`New min: ${min}`);
      }
    } else if (
      comp.output.length < comp.program.length &&
      comp.output.every(
        (it, idx, arr) =>
          it === BigInt(comp.program[idx]) || idx >= arr.length - 2
      )
    ) {
      // console.log(`Promising: ${bin} -> ${comp.outp()}`);
      next.add(regA.toString(2));
    }
  }
  return next;
}

// 1303985326538400 to high
// 130398532653840 to high
// 130398532653840
// 16299816581730 to low
