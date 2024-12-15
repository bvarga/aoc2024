import { readFileSync } from "node:fs";
import { Map } from "../lib/map.js";
import { Box } from "./box.js";

/** @type {string} */
const raw = readFileSync("15/input", "utf-8");

const data = raw.split("\n").reduce(
  (acc, line) => {
    if (line === "") {
      acc.moves = [];
      acc.map.load(acc.rawMap, (it, x, y) => {
        if (it === "@") {
          acc.robot = [x, y];
          return "@";
        }
        return it;
      });
      return acc;
    }
    if (!acc.moves) {
      acc.rawMap +=
        line
          .split("")
          .map((it) =>
            it === "@" ? "@." : it === "O" ? "[]" : it === "#" ? "##" : ".."
          )
          .join("") + "\n";
    } else {
      acc.moves.push(...line.split(""));
    }

    return acc;
  },
  /** @type {{rawMap: string, moves: string[] | null, map: Map<string>, robot: number[], boxes: [number,number][]}} */
  ({
    rawMap: "",
    moves: null,
    map: new Map(),
    robot: [0, 0],
  })
);

data.map.print((it) => it);
// console.log(data);

// data.moves?.forEach((dir) => {
//   move(data.robot, dir, data.map);
//   console.log(dir);
//   data.map.print((it) => it);
// });
// console.log(`Part 1: ${calcGPS(data.map)}`);

data.moves?.forEach((dir) => {
  /** @type {Box[]} */
  let boxesToMove = [];
  if (dir === ">") {
    const pix = data.map.data(data.robot[0] + 1, data.robot[1]);
    if (pix === "#") {
      return;
    } else if (pix === ".") {
      data.map.setData(data.robot[0], data.robot[1], ".");
      data.robot[0]++;
      data.map.setData(data.robot[0], data.robot[1], "@");
    } else if (pix === "[") {
      const box = new Box(data.map, data.robot[0] + 1, data.robot[1]);
      boxesToMove = box.canMove(dir);
    }
  } else if (dir === "<") {
    const pix = data.map.data(data.robot[0] - 1, data.robot[1]);
    if (pix === "#") {
      return;
    } else if (pix === ".") {
      data.map.setData(data.robot[0], data.robot[1], ".");
      data.robot[0]--;
      data.map.setData(data.robot[0], data.robot[1], "@");
    } else if (pix === "]") {
      const box = new Box(data.map, data.robot[0] - 2, data.robot[1]);
      boxesToMove = box.canMove(dir);
    }
  } else if (dir === "^") {
    const pix = data.map.data(data.robot[0], data.robot[1] - 1);
    if (pix === "#") {
      return;
    } else if (pix === ".") {
      data.map.setData(data.robot[0], data.robot[1], ".");
      data.robot[1]--;
      data.map.setData(data.robot[0], data.robot[1], "@");
    } else if (pix === "[") {
      const box = new Box(data.map, data.robot[0], data.robot[1] - 1);
      boxesToMove = box.canMove(dir);
    } else if (pix === "]") {
      const box = new Box(data.map, data.robot[0] - 1, data.robot[1] - 1);
      boxesToMove = box.canMove(dir);
    }
  } else if (dir === "v") {
    const pix = data.map.data(data.robot[0], data.robot[1] + 1);
    if (pix === "#") {
      return;
    } else if (pix === ".") {
      data.map.setData(data.robot[0], data.robot[1], ".");
      data.robot[1]++;
      data.map.setData(data.robot[0], data.robot[1], "@");
    } else if (pix === "[") {
      const box = new Box(data.map, data.robot[0], data.robot[1] + 1);
      boxesToMove = box.canMove(dir);
    } else if (pix === "]") {
      const box = new Box(data.map, data.robot[0] - 1, data.robot[1] + 1);
      boxesToMove = box.canMove(dir);
    }
  }

  if (boxesToMove.length) {
    /** @type {number} */
    let dx = dir === "<" ? -1 : dir === ">" ? 1 : 0;
    /** @type {number} */
    let dy = dir === "^" ? -1 : dir === "v" ? 1 : 0;

    let i = 0;
    while (i < boxesToMove.length) {
      let j = i + 1;
      while (
        j < boxesToMove.length &&
        !(
          boxesToMove[j].p[0] === boxesToMove[i].p[0] &&
          boxesToMove[j].p[1] === boxesToMove[i].p[1]
        )
      ) {
        j++;
      }
      if (j < boxesToMove.length) {
        boxesToMove.splice(j, 1);
      } else {
        i++;
      }
    }

    boxesToMove.forEach((box) => {
      box.move([dx, dy]);
    });
    data.map.setData(data.robot[0], data.robot[1], ".");
    data.robot[0] += dx;
    data.robot[1] += dy;
    data.map.setData(data.robot[0], data.robot[1], "@");
  }

  console.log(dir);
  data.map.print((it) => it);
});
console.log(`Part 2: ${calcGPS(data.map)}`);

/**
 *
 * @param {number[]} robot
 * @param {string} dir
 * @param {Map<string>} map
 */
function move(robot, dir, map) {
  /** @type {number} */
  let dx = dir === "<" ? -1 : dir === ">" ? 1 : 0;
  /** @type {number} */
  let dy = dir === "^" ? -1 : dir === "v" ? 1 : 0;

  let step = 1;
  let pix = map.data(robot[0] + step * dx, robot[1] + step * dy);
  while (pix !== "." && pix !== "#") {
    step++;
    pix = map.data(robot[0] + step * dx, robot[1] + step * dy);
  }

  if (pix === "#") {
    return;
  }

  while (step) {
    const toCoo = [robot[0] + step * dx, robot[1] + step * dy];
    const fromCoo = [robot[0] + (step - 1) * dx, robot[1] + (step - 1) * dy];
    const from = map.data(fromCoo[0], fromCoo[1]);
    map.setData(toCoo[0], toCoo[1], from);
    step--;
  }
  map.setData(robot[0], robot[1], ".");
  robot[0] += dx;
  robot[1] += dy;
}

/**
 *
 * @param {Map} map
 */
function calcGPS(map) {
  let value = 0;
  for (let y = 0; y < map.size.y; y++) {
    for (let x = 0; x < map.size.x; x++) {
      const pix = map.data(x, y);
      value += pix === "O" || pix === "[" ? y * 100 + x : 0;
    }
  }
  return value;
}
