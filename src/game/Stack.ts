/**
 * the stack of tetris pieces made by player
 */
class Stack {
  stackMatrix: number[][];

  constructor() {
    this.stackMatrix = [];
    this.createMatrix(20, 10);
  }

  createMatrix = (rows: number, cols: number) => {
    this.stackMatrix = Array.from({ length: rows }, () => new Array(cols));
  };

  emptyStack() {
    this.stackMatrix.forEach((row) => row.fill(0));
  }

  removeLines() {
    let removedCount = 0;
    let lineComplete = true;
    let y = this.stackMatrix.length - 1;
    while (y >= 0) {
      for (let x = 0; x < this.stackMatrix[y].length; x += 1) {
        // find a completed line
        if (this.stackMatrix[y][x] === 0) {
          lineComplete = false;
        }
      }
      if (lineComplete === true) {
        // shift everything down starting from index y to remove completed lines
        removedCount += 1;
        for (let i = y; i > 0; i -= 1) {
          this.stackMatrix[i] = [...this.stackMatrix[i - 1]];
        }
      } else {
        y -= 1;
        lineComplete = true;
      }
    }
    return removedCount;
  }
}

export default Stack;
