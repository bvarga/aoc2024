import { readFileSync } from "node:fs";
import { Map } from "../lib/map.js";
import { it } from "node:test";

/** @type {string} */
const raw = readFileSync("16/input", "utf-8");

const map = new Map();
map.load(raw, (it) => it);

const STEPS = {
  ">": [1, 0],
  "<": [-1, 0],
  "^": [0, -1],
  v: [0, 1],
};

let minimum = Infinity;
let bestToSit = new Set();

/** @typedef {{ score: number, road: [number, number, number][], steps: string[], count: number }} Path */

const start = map.find((it) => it === "S");
start.push(0);

/** @type {Path[]} */
let paths = [{ score: 0, road: [start], steps: [">"], count: 0 }];
let iteration = 0;
while (paths.length > 0) {
  console.log("Iteration", iteration, paths.length);
  /** @type {Path[]} */
  let next = [];
  paths.forEach((path) => {
    next = [...next, ...nextSteps(path, map)];
  });
  paths = next;
  iteration++;
}

console.log(`Part 2 ${bestToSit.size}`);

/**
 * @param {Path} path
 * @param {Map<string>} map
 * @returns {Path[]}
 */
function nextSteps(path, map) {
  const [x, y, score] = path.road[path.road.length - 1];
  const direction = path.steps[path.steps.length - 1];

  if (map.data(x, y) === "E") {
    console.log("Found path:", path.score);

    if (path.score < minimum) {
      minimum = path.score;
      bestToSit.clear();
      bestToSit = new Set(path.road.map(([x, y]) => `${x},${y}`));
    } else if (path.score === minimum) {
      path.road.forEach(([x, y]) => {
        bestToSit.add(`${x},${y}`);
      });
    }
    return [];
  }

  /** @type {Path[]} */
  const nexts = [];

  possibleDirections(direction)
    .map((dir) => [dir, STEPS[dir]])
    .forEach(([dir, [dx, dy]]) => {
      const next = map.data(x + dx, y + dy);
      if (next === "#") {
        return;
      }
      const newSCore = path.score + (direction === dir ? 1 : 1001);
      if (newSCore > minimum) {
        return;
      }

      if (path.road.find(([ox, oy]) => ox === x + dx && oy === y + dy)) {
        return;
      }

      const better = paths.find((p) => {
        return (
          p !== path &&
          p.road.find(
            ([ox, oy, oscore]) =>
              ox === x + dx && oy === y + dy && oscore < newSCore
          )
        );
      });
      if (better) {
        return;
      }

      const nextSteps = [...path.steps];
      if (direction !== dir) {
        nextSteps[nextSteps.length - 1] = "@";
      }
      nextSteps.push(dir);

      const nextRoads = [...path.road, [x + dx, y + dy, newSCore]];

      nexts.push({
        score: newSCore,
        count: path.count + direction === dir ? 1 : 2,
        road: nextRoads,
        steps: nextSteps,
      });
    });

  return nexts;
}

/**
 * @param {string} dir
 * @returns {string[]}
 */
function possibleDirections(dir) {
  switch (dir) {
    case ">":
      return [">", "^", "v"];
    case "<":
      return ["<", "^", "v"];
    case "^":
      return ["^", ">", "<"];
    case "v":
      return ["v", ">", "<"];
  }
  throw new Error("Invalid direction");
}

// 537 too low
