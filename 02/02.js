import { readFileSync } from "node:fs";

const raw = readFileSync("02/input", "utf-8");

const data = raw
  .split("\n")
  .filter(Boolean)
  .map((row) => row.split(" ").map(Number));

const validRows = data.filter(validFn);

function validFn(row) {
  let valid = true;
  let indx = 1;
  let inc;
  while (valid && indx < row.length) {
    const diff = row[indx] - row[indx - 1];
    const abs = Math.abs(diff);
    valid = abs >= 1 && abs <= 3 && (inc === undefined || diff > 0 === inc);
    inc = diff > 0;
    indx += 1;
  }
  // console.log(`${row} is ${valid ? "" : "NOT"} valid `);
  return valid;
}

console.log(`valid rows: ${validRows.length}`);

function valid2(row) {
  let valid = true;
  let indx = 0;
  let inc;
  while (valid && indx < row.length - 1) {
    const diff = row[indx + 1] - row[indx];
    const abs = Math.abs(diff);
    valid = abs >= 1 && abs <= 3 && (inc === undefined || diff > 0 === inc);
    if (!valid) {

      // console.log('failed at ', row[indx]);
      const row1 = row.filter((_, i) => i !== indx);
      const row2 = row.filter((_, i) => i !== indx + 1);
      const row3 = indx - 1 >= 0 ? row.filter((_, i) => i !== indx - 1) : row2;
      const res = validFn(row1) || validFn(row2) || validFn(row3);
      if (!res) {
        console.log(`${row.join(",")} can't be made valid. tried:`);
        console.log(`  ${row1.join(",")}`);
        console.log(`  ${row2.join(",")}`);
        console.log("");
      }
      return res;
    }
    inc = diff > 0;
    indx += 1;
  }
  return valid;
}

const validRows2 = data.filter(valid2);
console.log(`valid rows 2: ${validRows2.length}`);
// 460 too high
// 447 too low
// 452 too low
