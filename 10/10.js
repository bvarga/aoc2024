import { readFileSync } from "node:fs";
import { Map } from "../lib/map.js";

/** @type {string} */
const raw = readFileSync("10/input", "utf-8");
const map = new Map();

/** @type {{ x: number, y: number, tails: Set<string>, rate: number }[]} */
const trailheads = [];

map.load(raw, (it, x, y) => {
  if (it === "0") {
    trailheads.push({ x, y, tails: new Set(), rate: 0 });
  }
  return { height: Number(it) };
});

let points = trailheads.map((th, indx) => {
  return { x: th.x, y: th.y, height: 0, id: indx };
});

const directions = [
  {
    dx: 0,
    dy: -1,
  },
  {
    dx: 1,
    dy: 0,
  },
  {
    dx: 0,
    dy: 1,
  },
  {
    dx: -1,
    dy: 0,
  },
];

while (points.length > 0) {
  const next = points.reduce((acc, point) => {
    return directions.reduce((acc2, dir) => {
      const x = point.x + dir.dx;
      const y = point.y + dir.dy;
      const pixel = map.data(x, y);
      if (!pixel || pixel.height !== point.height + 1) {
        return acc2;
      }

      if (pixel.height === 9) {
        trailheads[point.id].tails.add(id(x, y));
        trailheads[point.id].rate++;
      } else {
        acc2.push({ x, y, height: pixel.height, id: point.id });
      }
      return acc2;
    }, acc);
  }, []);
  points = next;
}

console.log(
  "Part 1",
  trailheads.reduce((acc, it) => acc + it.tails.size, 0)
);

console.log(
  "Part 2",
  trailheads.reduce((acc, it) => acc + it.rate, 0)
);

/**
 *
 * @param {number} x
 * @param {number} y
 * @returns
 */
function id(x, y) {
  return `${x},${y}`;
}
