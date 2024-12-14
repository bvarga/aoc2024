export class Statement {
  /**
   * Get the parameters of the statements, example: mul(2,3) will return ['2','3']
   *
   * @param {string} statement
   * @returns {string[]}
   */
  static getParameters(statement) {
    const params = statement.substring(4, statement.length - 1).trim();
    return params === "" ? [] : params.split(",");
  }

  /**
   * Get the parameters of the statements as numbers, example: mul(2,3) will return ['2','3']
   *
   * @param {string} statement
   * @returns {number[]}
   */
  static getParametersAsNumbers(statement) {
    return Statement.getParameters(statement).map(Number);
  }
}
