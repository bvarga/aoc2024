import { readFileSync } from "node:fs";
import { Map } from "../lib/map.js";

/** @type {string} */
const raw = readFileSync("14/input", "utf-8");

/**
 * A number, or a string containing a number.
 * @typedef {{p: number[], v: number[]}} Robot
 */

let robots = raw
  .split("\n")
  .filter(Boolean)
  .reduce((acc, it) => {
    const [pos, vel] = it.split(" ");
    acc.push({
      p: pos.substring(2).split(",").map(Number),
      v: vel.substring(2).split(",").map(Number),
    });

    return acc;
  }, /** @type {Robot[]} */ ([]));

//const size = [11, 7];
const size = [101, 103];
const middle = size.map((it) => Math.floor(it / 2));

let i = 1;
while (!possibleEgg(robots)) {
  robots = robots.map((robot) => move(robot, size));

  if (i === 100) {
    console.log(`Part 1: ${calcQuadrants(robots)}`);
  }

  i++;
}

console.log("Possible Egg, after sec: ", i - 1);
printRobots(robots, size);

/**
 * @param {Robot[]} robots
 * @param {number[]} size
 */
function printRobots(robots, size) {
  const map = new Map();

  map.setSize({ x: size[0], y: size[1] });
  for (let x = 0; x < size[0]; x++) {
    for (let y = 0; y < size[1]; y++) {
      const pix = robots.filter(
        (robot) => robot.p[0] === x && robot.p[1] === y
      ).length;
      map.setData(x, y, pix ? pix : ".");
    }
  }

  console.log(map.print((it) => it));
}

/**
 *
 * @param {Robot} robot
 * @param {number[]} size
 * @returns {Robot}
 */
function move(robot, size) {
  const p = size.map(
    (it, indx) => (robot.p[indx] + robot.v[indx]) % size[indx]
  );
  return {
    p: p.map((it, indx) => (it < 0 ? size[indx] + it : it)),
    v: robot.v,
  };
}

/**
 * @param {Robot[]} robots
 * @returns {number}
 */
function calcQuadrants(robots) {
  const quadrants = robots.reduce((acc, robot) => {
    if (robot.p[0] < middle[0] && robot.p[1] < middle[1]) {
      acc[0]++;
    } else if (robot.p[0] > middle[0] && robot.p[1] > middle[1]) {
      acc[1]++;
    } else if (robot.p[0] < middle[0] && robot.p[1] > middle[1]) {
      acc[2]++;
    } else if (robot.p[0] > middle[0] && robot.p[1] < middle[1]) {
      acc[3]++;
    }
    return acc;
  }, /** @type {number[]} */ ([0, 0, 0, 0]));

  return quadrants.reduce((acc, it) => acc * it, 1);
}

/**
 * @param {Robot[]} robots
 */
function possibleEgg(robots) {
  const neighbours = robots.reduce((acc, robot) => {
    return (
      acc +
      robots.filter((it) => {
        return (
          Math.abs(it.p[0] - robot.p[0]) <= 1 &&
          Math.abs(it.p[1] - robot.p[1]) <= 1
        );
      }).length
    );
  }, 0);

  return neighbours > 2000;
}
