import { readFileSync } from "node:fs";
import { Map } from "../lib/map.js";

/** @type({ sign: string, dx: number, dy: number }[]) */
const dir = [
  { sign: "^", dx: 0, dy: -1 },
  { sign: ">", dx: 1, dy: 0 },
  { sign: "v", dx: 0, dy: 1 },
  { sign: "<", dx: -1, dy: 0 },
];

class Guard {
  /** @type {number} */
  #x = 0;

  /** @type {number} */
  #y = 0;

  /** @type {number} */
  #initx;

  /** @type {number} */
  #inity;

  /** @type {string} */
  #dir = "^";

  /** @type {Map<string>} */
  #map;

  /** @type {{ x: number, y: number, dir: string}[]} */
  #history = [];

  /** @type {number} */
  #loops = 0;

  /** @type {boolean} */
  cloned = false;

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {string} dir
   * @param {Map<string>} map
   * @param {{ x: number, y: number, dir: string}[]=} history
   */
  constructor(x, y, dir, map, history) {
    this.#x = x;
    this.#y = y;
    this.#initx = x;
    this.#inity = y;
    this.#dir = dir;
    this.#map = map;
    this.#history = history ?? [{ x, y, dir }];
  }

  /**
   * @param {number} x
   * @param {number} y
   * * @param {string} dir
   */
  add(x, y, dir) {
    this.#history.push({ x, y, dir });
  }

  clone() {
    const clone = new Guard(this.#x, this.#y, this.#dir, this.#map, [
      ...this.#history,
    ]);
    clone.cloned = true;
    return clone;
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {string} dir
   * @returns {boolean}
   */
  exists(x, y, dir) {
    return this.#history.some(
      (it) => it.x === x && it.y === y && it.dir === dir
    );
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  wasHere(x, y) {
    return this.#history.some((it) => it.x === x && it.y === y);
  }

  visitedPixelsCount() {
    return new Set(this.#history.map((it) => `${it.x},${it.y}`)).size;
  }

  /**
   * @param {boolean} [placeObstacle=false]
   * @returns {boolean}
   * */
  step(placeObstacle) {
    const currentIndex = dir.findIndex((it) => it.sign === this.#dir);
    const current = dir[currentIndex];
    const nx = this.#x + current.dx;
    const ny = this.#y + current.dy;

    if (nx < 0 || nx >= map.size.x || ny < 0 || ny >= map.size.y) {
      // finished
      return false;
    }

    if (map.data(nx, ny) === "#") {
      // turn right
      const nextIndex = (currentIndex + 1) % 4;
      this.#dir = dir[nextIndex].sign;
      this.add(this.#x, this.#y, this.#dir);
      return true;
    }

    if (
      placeObstacle &&
      !this.wasHere(nx, ny) &&
      !(nx === this.#initx && ny === this.#inity)
    ) {
      const original = this.#map.data(nx, ny);
      this.#map.setData(nx, ny, "#");
      const subGuard = this.clone();
      while (subGuard.step()) {}
      this.#loops += subGuard.loops;
      this.#map.setData(nx, ny, original ?? ".");
    }

    // move forward
    this.#x = nx;
    this.#y = ny;

    if (this.exists(this.#x, this.#y, this.#dir)) {
      if (!this.cloned) {
        console.log("Loop detected when moving forward on original");
      }
      this.#loops++;
      return false;
    }

    this.add(nx, ny, this.#dir);
    return true;
  }

  get loops() {
    return this.#loops;
  }
}

/** @type {string} */
const raw = readFileSync("06/input", "utf-8");
const map = new Map();
map.load(raw, (it) => it);
let [x, y] = map.find((pixel) => pixel === "^");
console.log("starting point: ", x, y);

const guard = new Guard(x, y, "^", map);
while (guard.step(true)) {}

console.log(`Part 1: ${guard.visitedPixelsCount()}`);
console.log(`Part 2: ${guard.loops}`);

// 2124 too high
// 2123 too high
