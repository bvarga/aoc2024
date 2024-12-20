import { readFileSync } from "node:fs";
import { Map } from "../lib/map.js";

/** @type {string} */
const raw = readFileSync("20/input", "utf-8");

const map = new Map();
map.load(raw, (it) => it);

const path = [map.find((it) => it === "S")];
const end = map.find((it) => it === "E");

while (
  path[path.length - 1][0] !== end[0] ||
  path[path.length - 1][1] !== end[1]
) {
  const [x, y] = path[path.length - 1];
  const [px, py] = path[Math.max(path.length - 2, 0)];
  const next = [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
  ].filter(
    ([nx, ny]) =>
      (map.data(nx, ny) === "." || map.data(nx, ny) === "E") &&
      !(px === nx && py === ny)
  );

  if (next.length !== 1) {
    throw new Error(`No or multiple path found (${x},${y})`);
  } else {
    path.push(next[0]);
  }
}

const part1 = [];

path.forEach(([x, y], indx) => {
  const deltas = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  const cheats = deltas
    .map(([dx, dy]) => {
      const pix1 = map.data(x + dx, y + dy);
      const pix2 = map.data(x + 2 * dx, y + 2 * dy);
      return pix1 === "#" &&
        !!pix2 &&
        pix2 !== "#" &&
        path.findIndex(([px, py]) => px === x + 2 * dx && py === y + 2 * dy) >
          indx
        ? [dx, dy]
        : null;
    })
    .filter(Boolean);

  cheats.forEach(([dx, dy]) => {
    const toIndx = path.findIndex(
      ([px, py]) => px === x + 2 * dx && py === y + 2 * dy
    );

    part1.push({
      save: toIndx - indx - 2,
      from: [x + dx, y + dy],
      to: [x + 2 * dx, y + 2 * dy],
    });
  });
});

const res1 = part1.reduce((acc, { save }) => {
  acc[save] = (acc[save] || 0) + 1;
  return acc;
}, {});

const moreThan100 = Object.entries(res1).reduce(
  (acc, [save, count]) => (Number(save) >= 100 ? acc + count : acc),
  0
);
console.log(`Part 1: ${moreThan100}`);
