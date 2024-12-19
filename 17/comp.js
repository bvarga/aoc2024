export class Comp {
  regA = BigInt(0);
  regB = BigInt(0);
  regC = BigInt(0);
  ip = 0;

  /** @type {number[]} */
  program = [];

  /** @type {BigInt[]} */
  output = [];

  debug = false;
  constructor(debug = false) {
    this.debug = debug;
  }
  /** @param {number} operand */
  adv(operand) {
    this.regA = this.regA / 2n ** this.comboOperand(operand);
    //this.regA = Math.floor(this.regA / Math.pow(2, this.comboOperand(operand)));
  }

  /** @param {number} operand */
  bxl(operand) {
    this.regB = this.regB ^ BigInt(operand);
  }

  /** @param {number} operand */
  bst(operand) {
    this.regB = this.comboOperand(operand) % 8n;
  }

  /** @param {number} operand */
  jnz(operand) {
    if (this.regA !== 0n) {
      if (this.debug) {
        console.log("jnz junmp to", operand);
      }
      this.ip = operand - 2;
    }
  }

  bxc() {
    this.regB = this.regB ^ this.regC;
  }

  /** @param {number} operand */
  out(operand) {
    this.output.push(this.comboOperand(operand) % 8n);
  }

  /** @param {number} operand */
  bdv(operand) {
    this.regB = this.regA / 2n ** this.comboOperand(operand);
  }

  /** @param {number} operand */
  cdv(operand) {
    this.regC = this.regA / 2n ** this.comboOperand(operand);
  }

  /**
   * @param {string} raw
   */
  load(raw) {
    this.output = [];
    this.ip = 0;
    raw
      .split("\n")
      .filter(Boolean)
      .forEach((line) => {
        if (line.startsWith("Register A:")) {
          this.regA = BigInt(line.split(" ")[2]);
        } else if (line.startsWith("Register B:")) {
          this.regB = BigInt(line.split(" ")[2]);
        } else if (line.startsWith("Register C:")) {
          this.regC = BigInt(line.split(" ")[2]);
        } else if (line.startsWith("Program:")) {
          this.program = line.split(" ")[1].split(",").map(Number);
        } else {
          throw new Error(`Invalid line: ${line}`);
        }
      });
  }

  clear() {
    this.regA = 0n;
    this.regB = 0n;
    this.regC = 0n;
    this.ip = 0;
    this.output = [];
  }
  print() {
    console.log(
      JSON.stringify(
        {
          regA: this.regA,
          regB: this.regB,
          regC: this.regC,
          ip: this.ip,
          program: this.program,
        },
        null,
        2
      )
    );
  }

  run() {
    try {
      this.output = [];

      if (this.debug) {
        console.log(
          `initial: A: ${this.regA}, B: ${this.regB}, C: ${this.regC}`
        );
      }

      while (this.ip < this.program.length) {
        const opCode = this.program[this.ip];
        const operand = this.program[this.ip + 1];
        switch (opCode) {
          case 0:
            this.adv(operand);
            break;
          case 1:
            this.bxl(operand);
            break;
          case 2:
            this.bst(operand);
            break;
          case 3:
            this.jnz(operand);
            break;
          case 4:
            this.bxc();
            break;
          case 5:
            this.out(operand);
            break;
          case 6:
            this.bdv(operand);
            break;
          case 7:
            this.cdv(operand);
            break;
        }
        if (this.debug) {
          console.log(
            `code: ${opCode}, operand: ${operand}, A: ${this.regA}, B: ${this.regB}, C: ${this.regC}`
          );
        }
        this.ip += 2;
      }
    } catch (e) {
      console.error("Error running program");
      //this.print();
      console.error(e);
    }
  }

  /**
   * @param {number} operand
   * @returns {BigInt}
   */
  comboOperand(operand) {
    if (operand >= 0 && operand <= 3) {
      return BigInt(operand);
    } else if (operand === 4) {
      return this.regA;
    } else if (operand === 5) {
      return this.regB;
    } else if (operand === 6) {
      return this.regC;
    } else if (operand === 7) {
      throw new Error("operant 7 is reserved for future use");
    }
    throw new Error(`Invalid combo operand: ${operand}`);
  }

  outp() {
    return this.output.join(",");
  }

  /** @type {{[key: number]: (operand: number) => void}} */
  instructions = {
    0: this.adv,
    1: this.bxl,
    2: this.bst,
    3: this.jnz,
    4: this.bxc,
    5: this.out,
    6: this.bdv,
    7: this.cdv,
  };
}
