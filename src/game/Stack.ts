class Stack {
  stackMatrix: number[][];

  constructor() {
    // Matrix(x: 10, y: 20)
    this.stackMatrix = Array.from({ length: 10 }, () => new Array(20).fill(0));
  }

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
        // shift everything down starting from index y to cover a single completed line
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
