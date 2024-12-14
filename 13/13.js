import { readFileSync } from "node:fs";
import { BigFloat32 } from "bigfloat";

/** @type {string} */
const raw = readFileSync("13/input", "utf-8");

/**
 * A number, or a string containing a number.
 * @typedef {{ a: { dx: number, dy: number }, b: { dx: number, dy: number }, prize: { x: number, y: number } }} Machine
 */

const costs = {
  a: 3,
  b: 1,
};

const machines = raw.split("\n").reduce((acc, it, indx) => {
  if (it === "" || indx === 0) {
    acc.push({
      a: { dx: 0, dy: 0 },
      b: { dx: 0, dy: 0 },
      prize: { x: 0, y: 0 },
    });
  }
  if (it.startsWith("Button A:")) {
    const tmp = it
      .substring(10)
      .split(",")
      .map((it) => Number(it.trim().substring(2)));
    acc[acc.length - 1].a = { dx: tmp[0], dy: tmp[1] };
  } else if (it.startsWith("Button B:")) {
    const tmp = it
      .substring(10)
      .split(",")
      .map((it) => Number(it.trim().substring(2)));
    acc[acc.length - 1].b = { dx: tmp[0], dy: tmp[1] };
  } else if (it.startsWith("Prize:")) {
    const tmp = it
      .substring(6)
      .split(",")
      .map((it) => Number(it.trim().substring(2)));
    acc[acc.length - 1].prize = { x: tmp[0], y: tmp[1] };
  }
  return acc;
}, /** @type {Machine[]} */ ([]));

console.log(machines);

const part1 = machines.reduce((acc, machine) => {
  const res = calc(machine);

  return acc + (res ? costs.a * res.a + costs.b * res.b : 0);
}, 0);

console.log(`Part 1: ${part1}`);

const part2 = machines
  .map((machine) => ({
    ...machine,
    prize: {
      x: machine.prize.x + 10000000000000,
      y: machine.prize.y + 10000000000000,
    },
  }))
  .reduce((acc, machine) => {
    const res = calc2(machine);
    console.log(res);

    return acc + (res ? costs.a * res.a + costs.b * res.b : 0);
  }, 0);

console.log(`Part 2: ${part2}`);

/**
 *
 * @param {Machine} machine
 * @returns {{ a: number, b: number } | null}
 */
function calc(machine) {
  let x = 0;
  let y = 0;
  let ma = 0;
  let mb = 0;
  while (x < machine.prize.x && y < machine.prize.y) {
    const mbx = (machine.prize.x - x) / machine.b.dx;
    const mby = (machine.prize.y - y) / machine.b.dy;
    if (mbx % 1 === 0 && mby % 1 === 0 && mbx === mby) {
      return { a: ma, b: mbx };
    }
    ma++;
    x += machine.a.dx;
    y += machine.a.dy;
  }

  return null;
}

/**
 *
 * @param {Machine} machine
 * @returns {{ a: number, b: number } | null}
 */
function calc2(machine) {
  const mb =
    (machine.prize.y - (machine.a.dy / machine.a.dx) * machine.prize.x) /
    (machine.b.dy - (machine.a.dy / machine.a.dx) * machine.b.dx);
  const ma = (machine.prize.x - mb * machine.b.dx) / machine.a.dx;
  console.log(`ma: ${ma}, mb: ${mb}`);

  const ea = Math.abs(ma - Math.round(ma));
  const eb = Math.abs(mb - Math.round(mb));

  if (ea < 0.01 && eb < 0.01) {
    // <- tricky part because of big floating point uncertainty
    return { a: Math.round(ma), b: Math.round(mb) };
  }
  return null;
}
