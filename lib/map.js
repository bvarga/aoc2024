/**
 *
 * @template T
 */
export class Map {
  /** @type {T[][]} */
  #data;

  /**
   * @param {T[][]=} data
   */
  constructor(data) {
    this.#data = data ?? [];
  }

  /**
   *
   * @param {string} input
   * @param {(char: string, x: number, y: number) => T} [fn]
   */
  load(input, fn) {
    const rows = input.split("\n").filter(Boolean);
    this.#data = rows.map((row, y) =>
      row.split("").map((it, x) => {
        return fn ? fn(it, x, y) : it;
      })
    );
  }

  /**
   * @param {(pixel: T) => T} fn
   * @returns {Map<T>}
   *
   */
  clone(fn) {
    const newData = Array.from({ length: this.size.y }, (_, y) =>
      Array.from({ length: this.size.x }, (_, x) => fn(this.#data[y][x]))
    );
    return new Map(newData);
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   *
   */
  data(x, y) {
    return x >= 0 && x < this.size.x && y >= 0 && y < this.size.y
      ? this.#data[y][x]
      : undefined;
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {T} data
   */

  setData(x, y, data) {
    if (x >= 0 && x < this.size.x && y >= 0 && y < this.size.y) {
      this.#data[y][x] = data;
    } else {
      throw new Error("Invalid coordinates");
    }
  }

  /**
   *
   * @param {(pixel: T) => boolean} fn
   * @returns {number}
   */
  countData(fn) {
    let count = 0;
    for (let y = 0; y < this.size.y; y++) {
      for (let x = 0; x < this.size.x; x++) {
        count += fn(this.#data[y][x]) ? 1 : 0;
      }
    }
    return count;
  }

  /**
   * @param {(pixel: T) => boolean} fn
   * @returns {[number,number]}
   */
  find(fn) {
    for (let y = 0; y < this.size.y; y++) {
      for (let x = 0; x < this.size.x; x++) {
        if (fn(this.#data[y][x])) {
          return [x, y];
        }
      }
    }
    return [-1, -1];
  }

  /**
   * @param {(pixel: T) => boolean} fn

   */
  print(fn) {
    console.log(
      this.#data
        .map((row) => row.map((it) => (fn ? fn(it) : it)).join(""))
        .join("\n")
    );
    console.log("");
  }

  /**
   * @returns {{ x: number, y: number }}
   */
  get size() {
    return {
      x: this.#data.length ? this.#data[0].length : 0,
      y: this.#data.length,
    };
  }

  /**
   * @param {{ x: number, y: number }} value
   */
  setSize(value) {
    this.#data = Array.from({ length: value.y }, () =>
      Array.from({ length: value.x })
    );
  }

  /**
   * @param {() => T} fn
   */
  fill(fn) {
    this.#data = Array.from({ length: this.size.y }, () =>
      Array.from({ length: this.size.x }, () => fn())
    );
  }
}
