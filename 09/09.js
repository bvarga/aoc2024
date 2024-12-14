import { readFileSync } from "node:fs";

/** @type {string} */
const raw = readFileSync("09/input.txt", "utf-8");
const nums = raw.split("").map(Number);

/** @type {(string | number)[]} */
const disk = Array.from({ length: nums.reduce((acc, it) => acc + it, 0) });

let seek = 0;
let fileId = 0;
nums.forEach((it, indx) => {
  const isFile = indx % 2 === 0;
  Array.from({ length: it }).forEach((_, size) => {
    disk[seek + size] = isFile ? fileId : ".";
  });
  seek += it;

  if (isFile) {
    fileId++;
  }
});
const disk2 = [...disk];
compact(disk);
console.log(`Part 1: ${chcecksum(disk)}`);

/**
 *
 * @param {(string | number)[]} disk
 */
function compact(disk) {
  while (move(disk)) {}
}

let indx = disk.length - 1;

while (indx >= 0) {
  if (disk2[indx] !== ".") {
    const data = disk2[indx];
    const end = indx;
    indx--;
    while (disk2[indx] === data) {
      indx--;
    }
    const start = indx + 1;
    const len = end - start + 1;

    const space = findSpace(disk2, len, start);
    if (space && space[0] < start) {
      for (let i = space[0]; i <= (space[0] + end - start); i++) {
        disk2[i] = data;
      }
      for (let i = start; i <= end; i++) {
        disk2[i] = ".";
      }
    }
  } else {
    indx--;
  }
}

console.log("Part 2:", chcecksum(disk2));

/**
 *
 * @param {(string | number)[]} disk
 * @param {number} len
 * @param {number} max
 * @returns {[number, number] | null}
 */

function findSpace(disk, len, max) {
  let from = 0;
  let start = 0;
  let end = -1;
  while (end - start + 1 < len) {
    start = disk.indexOf(".", from);
    let indx = start;
    while (disk[indx] === ".") {
      indx++;
    }
    end = indx - 1;
    if (end - start + 1 < len) {
      from = end + 1;
      if (from >= max) {
        return null;
      }
    }
  }
  return [start, end];
}

/**
 *
 * @param {(string | number)[]} disk
 * @returns {boolean}
 */
function move(disk) {
  let spaceIndx = disk.indexOf(".");
  let lastBlockIndx = disk.findLastIndex((it) => it !== ".");

  if (spaceIndx > lastBlockIndx) {
    return false;
  }

  const data = disk[lastBlockIndx];
  disk[lastBlockIndx] = ".";
  disk[spaceIndx] = data;
  return true;
}

/**
 *  @param {(string | number)[]} disk
 */
function chcecksum(disk) {
  return disk.reduce((acc, it, indx) => {
    return acc + (it !== "." ? indx * it : 0);
  }, 0);
}
