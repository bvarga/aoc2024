import { readFileSync } from "node:fs";

const raw = readFileSync("input.1", "utf-8");

const data = raw.split("\n").filter(Boolean);

const oszlop1 = data.map((row) => row.split("   ")[0]).sort();
const oszlop2 = data.map((row) => row.split("   ")[1]).sort();

const sum = oszlop1.reduce((acc, item, index) => {
  return Math.abs(item - oszlop2[index]) + acc;
}, 0);

console.log(sum);

const hason = oszlop1.reduce((acc, item, index) => {
  const count = oszlop2.filter((it) => it === item).length;
  return Math.abs(item * count) + acc;
}, 0);

console.log(`Hasonlosagi: ${hason}`);
