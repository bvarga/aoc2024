import { readFileSync } from "node:fs";
import { Map } from "../lib/map.js";

/** @type {string} */
const raw = readFileSync("18/input", "utf-8");
const size = [71, 71];
//const size = [7, 7];
const firstBytes = 1024;
//const firstBytes = 12;

/** @type {{x: number, y: number, i: number}[]} */
const bytes = raw.split("\n").map((it, indx) => {
  const line = it.split(",");
  return {
    x: Number(line[0]),
    y: Number(line[1]),
    i: indx,
  };
});

/** @typedef {{ meta: { steps: [number, number][] | null }, pix: string }} Pix*/

/** @type {Map<Pix>} */
const map = new Map();
map.setSize({ x: size[0], y: size[1] });
map.fill(() => ({ meta: { steps: null }, pix: "." }));

bytes.forEach((it, indx) => {
  if (indx < firstBytes) {
    map.setData(it.x, it.y, { meta: { steps: null }, pix: "#" });
  }
});

map.setData(0, 0, { meta: { steps: [] }, pix: "S" });
map.print((it) => it.pix);

const part1 = travel(map, [0, 0], [size[0] - 1, size[1] - 1]);
console.log("Part 1:", part1.join(", "));

let foundBlocking = false;
let fallen = 0;
while (!foundBlocking) {
  map.fill(() => ({ meta: { steps: null }, pix: "." }));
  map.setData(0, 0, { meta: { steps: [] }, pix: "S" });
  for (let i = 0; i < fallen; i++) {
    map.setData(bytes[i].x, bytes[i].y, { meta: { steps: null }, pix: "#" });
  }
  const part2 = travel(map, [0, 0], [size[0] - 1, size[1] - 1]);
  if (part2.length === 0) {
    console.log(`Part 2: ${bytes[fallen - 1].x},${bytes[fallen - 1].y}`);
    foundBlocking = true;
  }
  fallen++;
}

/**
 *
 * @param {Map<Pix>} map
 * @param {[number, number]} from
 * @param {[number, number]} to
 * @returns {number[]}
 */
function travel(map, from, to) {
  const toCheck = [from];
  const DELTAS = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  /** @type {number[]} */
  const founded = [];

  while (toCheck.length > 0) {
    const coords = toCheck.shift();
    if (!coords) {
      throw new Error("No coords");
    }
    const current = map.data(coords[0], coords[1]);

    if (coords[0] === to[0] && coords[1] === to[1]) {
      founded.push(current.meta.steps.length);
      // console.log("Found path:", current.meta.steps.length);
      continue;
    }

    DELTAS.forEach((it) => {
      const x = coords[0] + it[0];
      const y = coords[1] + it[1];

      const next = map.data(x, y);
      if (!next) {
        return;
      }

      if (next.pix === "#") {
        return;
      }

      if (
        next.meta.steps !== null &&
        next.meta?.steps?.length <= current.meta.steps.length + 1
      ) {
        return;
      }

      next.meta.steps = [...current?.meta.steps, [x, y]];
      toCheck.push([x, y]);
    });
  }
  return founded;
}
