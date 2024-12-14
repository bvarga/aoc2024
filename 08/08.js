import { readFileSync } from "node:fs";
import { Map } from "../lib/map.js";

/** @type {string} */
const raw = readFileSync("08/input", "utf-8");

const map = new Map();

/** @type {{ [key: string]: { x: number, y: number }[] }} */
const antennas = {};

map.load(raw, (it, x, y) => {
  if (it !== ".") {
    antennas[it] = antennas[it] ?? [];
    antennas[it].push({ x, y });
  }
  return { antenna: it, antinodes: [] };
});
map.print((it) => it.antenna);
// console.log(antennas);

Object.entries(antennas).forEach(([antenna, nodes]) => {
  /**
   * @type {[{ x: number, y: number }, { x: number, y: number }][]}
   */
  const pairs = [];

  nodes.forEach((node, indx) => {
    for (let i = indx + 1; i < nodes.length; i++) {
      pairs.push([node, nodes[i]]);
    }
  });

  pairs.forEach(([a, b]) => {
    const [dx, dy] = dist(a.x, a.y, b.x, b.y);

    let a1 = { x: a.x - dx, y: a.y - dy };

    let data = map.data(a1.x, a1.y);
    while (data) {
      map.setData(a1.x, a1.y, {
        ...data,
        antinodes: [...data.antinodes, antenna],
      });
      a1 = { x: a1.x - dx, y: a1.y - dy };
      data = map.data(a1.x, a1.y);
    }

    //map.print((it) => (it.antinodes.length > 0 ? "#" : it.antenna));
    let a2 = { x: b.x + dx, y: b.y + dy };
    data = map.data(a2.x, a2.y);
    while (data) {
      map.setData(a2.x, a2.y, {
        ...data,
        antinodes: [...data.antinodes, antenna],
      });
      a2 = { x: a2.x + dx, y: a2.y + dy };
      data = map.data(a2.x, a2.y);
    }
  });
  // console.log(pairs);
});

const sum = map.countData((it) => it.antinodes.length > 0 || it.antenna !== ".");

map.print((it) => (it.antinodes.length > 0 ? "#" : it.antenna));
console.log("Part 1", sum);

/**
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @retruns {[number, number]}
 */
function dist(x1, y1, x2, y2) {
  return [x2 - x1, y2 - y1];
}
