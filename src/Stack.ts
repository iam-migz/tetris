/*
  initialize:
  1. store stackMatrix                                        DONE  
  2. remove lines method, returns number of lines removed     Doing..
*/
class Stack {
  stackMatrix: boolean[][];
  constructor() {
    this.stackMatrix = this.createMatrix(10, 20);
  }
  gameOver() {
    this.stackMatrix.forEach((row) => row.fill(false));
  }
  removeLines() {}

  createMatrix(sizeX: number, sizeY: number): boolean[][] {
    const matrix: boolean[][] = [];
    for (let i = 0; i < sizeY; i++) {
      matrix.push(new Array(sizeX).fill(false));
    }
    return matrix;
  }
}

export default Stack;
