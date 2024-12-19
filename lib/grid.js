/**
 *
 * @template T
 */
export class Grid {
  size;

  /** @type {Record<string, T>} */
  data = {};

  /**
   * @param {number[]} size
   */
  constructor(size) {
    this.size = size;
  }

  /**
   * @param {string} input
   * @param {(char: string, x: number, y: number) => T} mapper
   */
  load2D(input, mapper) {
    const rows = input.split("\n").filter(Boolean);
    rows.forEach((row, y) =>
      row.split("").forEach((it, x) => {
        this.data[`${x},${y}`] = mapper(it, x, y);
      })
    );
  }

  /**
   * @param {number[]} coordinates
   */
  item(coordinates) {
    return this.data[coordinates.join(",")];
  }

  /**
   * @param {(x: number, y: number, item: T ) => string} [mapper]
   * @param {boolean} [update]
   */
  print2D(mapper, update = false) {
    if (this.dimension !== 2) {
      throw new Error("Can only print 2D grids");
    }

    let output = "";
    for (let y = 0; y < this.size[1]; y++) {
      for (let x = 0; x < this.size[0]; x++) {
        output += mapper
          ? mapper(x, y, this.item([x, y]))
          : this.data[`${x},${y}`];
      }
      output += "\n";
    }

    console.log(output);
  }

  get dimension() {
    return this.size.length;
  }
}
