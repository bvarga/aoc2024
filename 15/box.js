import { Map } from "../lib/map.js";

export class Box {
  /**
   * @param {Map<string>} map
   * @param {number} x
   * @param {number} y
   */
  constructor(map, x, y) {
    this.map = map;
    this.p = [x, y];
  }

  /**
   *
   * @param {string} dir
   * @returns {Box[]}
   */

  canMove(dir) {
    if (dir === ">") {
      const pix = this.map.data(this.p[0] + 2, this.p[1]);
      if (pix === "#") {
        return [];
      } else if (pix === ".") {
        return [this];
      } else if (pix === "[") {
        const box = new Box(this.map, this.p[0] + 2, this.p[1]);
        const boxes = box.canMove(">");
        return boxes.length ? [...boxes, this] : [];
      }
      throw new Error(`invalid pixel ${pix}, dir: ${dir}`);
    }

    if (dir === "<") {
      const pix = this.map.data(this.p[0] - 1, this.p[1]);
      if (pix === "#") {
        return [];
      } else if (pix === ".") {
        return [this];
      } else if (pix === "]") {
        const box = new Box(this.map, this.p[0] - 2, this.p[1]);
        const boxes = box.canMove("<");
        return boxes.length ? [...boxes, this] : [];
      }
      throw new Error("invalid pixel");
    }

    if (dir === "^") {
      const pix1 = this.map.data(this.p[0], this.p[1] - 1);
      const pix2 = this.map.data(this.p[0] + 1, this.p[1] - 1);
      if (pix1 === "#" || pix2 === "#") {
        return [];
      } else if (pix1 === "." && pix2 === ".") {
        return [this];
      } else if (pix1 === "[") {
        const box = new Box(this.map, this.p[0], this.p[1] - 1);
        const boxes = box.canMove("^");
        return boxes.length ? [...boxes, this] : [];
      } else {
        let boxes = [];
        if (pix1 === "]") {
          const box = new Box(this.map, this.p[0] - 1, this.p[1] - 1);
          const b1 = box.canMove("^");
          if (b1.length === 0) {
            return [];
          }
          boxes.push(...b1);
        }
        if (pix2 === "[") {
          const box = new Box(this.map, this.p[0] + 1, this.p[1] - 1);
          const b2 = box.canMove("^");
          if (b2.length === 0) {
            return [];
          }
          boxes.push(...b2);
        }
        return [...boxes, this];
      }
    } else if (dir === "v") {
      const pix1 = this.map.data(this.p[0], this.p[1] + 1);
      const pix2 = this.map.data(this.p[0] + 1, this.p[1] + 1);
      if (pix1 === "#" || pix2 === "#") {
        return [];
      } else if (pix1 === "." && pix2 === ".") {
        return [this];
      } else if (pix1 === "[") {
        const box = new Box(this.map, this.p[0], this.p[1] + 1);
        const boxes = box.canMove("v");
        return boxes.length ? [...boxes, this] : [];
      } else {
        let boxes = [];
        if (pix1 === "]") {
          const box = new Box(this.map, this.p[0] - 1, this.p[1] + 1);
          const b1 = box.canMove("v");
          if (b1.length === 0) {
            return [];
          }
          boxes.push(...b1);
        }
        if (pix2 === "[") {
          const box = new Box(this.map, this.p[0] + 1, this.p[1] + 1);
          const b2 = box.canMove("v");
          if (b2.length === 0) {
            return [];
          }
          boxes.push(...b2);
        }
        return [...boxes, this];
      }
    }
    throw new Error("invalid pixel");
  }

  /**
   *
   * @param {[number,number]} dir
   */
  move(dir) {
    if (dir[0] === 1) {
      this.map.setData(this.p[0], this.p[1], ".");
      this.map.setData(this.p[0] + 1, this.p[1], "[");
      this.map.setData(this.p[0] + 2, this.p[1], "]");
    } else if (dir[0] === -1) {
      this.map.setData(this.p[0] - 1, this.p[1], "[");
      this.map.setData(this.p[0], this.p[1], "]");
      this.map.setData(this.p[0] + 1, this.p[1], ".");
    } else if (dir[1] === 1) {
      this.map.setData(this.p[0], this.p[1], ".");
      this.map.setData(this.p[0] + 1, this.p[1], ".");
      this.map.setData(this.p[0], this.p[1] + 1, "[");
      this.map.setData(this.p[0] + 1, this.p[1] + 1, "]");
    } else if (dir[1] === -1) {
      this.map.setData(this.p[0], this.p[1], ".");
      this.map.setData(this.p[0] + 1, this.p[1], ".");
      this.map.setData(this.p[0], this.p[1] - 1, "[");
      this.map.setData(this.p[0] + 1, this.p[1] - 1, "]");
    }
    this.p = [this.p[0] + dir[0], this.p[1] + dir[1]];
  }
}
