import Piece from "./Piece";

/**
 * the stack of tetris pieces made by player
 */
class Stack {
  matrix: number[][];

  constructor() {
    this.matrix = [[]];
    this.createMatrix(20, 10);
  }

  createMatrix = (rows: number, cols: number) => {
    this.matrix = Array.from({ length: rows }, () => new Array(cols).fill(0));
  };

  emptyStack() {
    this.matrix.forEach((row) => row.fill(0));
  }

  removeLines() {
    let removedCount = 0;
    let lineComplete = true;
    let y = this.matrix.length - 1;
    while (y >= 0) {
      for (let x = 0; x < this.matrix[y].length; x += 1) {
        // find a completed line
        if (this.matrix[y][x] === 0) {
          lineComplete = false;
        }
      }
      if (lineComplete === true) {
        // shift everything down starting from index y to remove completed lines
        removedCount += 1;
        for (let i = y; i > 0; i -= 1) {
          this.matrix[i] = [...this.matrix[i - 1]];
        }
      } else {
        y -= 1;
        lineComplete = true;
      }
    }
    return removedCount;
  }

  // returns true if we're in a collision with the bottom wall or the current stack
  stackCollision(piece: Piece) {
    for (let y = 0; y < piece.matrix.length; y += 1) {
      for (let x = 0; x < piece.matrix[y].length; x += 1) {
        if (piece.matrix[y][x] !== 0) {
          const realx = piece.offsetX + x;
          const realy = piece.offsetY + y;
          
          // check if we are colliding with the bottom wall
          if (realy >= this.matrix.length) {
            return true;
          }
          
          // check if we are colliding with the existing stack
          if (this.matrix[realy][realx] !== 0) {
            return true;
          }
          
        }
      }
    }
    return false;
  }

  // merge stackMatrix & pieceMatrix
  merge(activePiece: Piece) {
    const { matrix, offsetY, offsetX } = activePiece;

    for (let y = 0; y < matrix.length; y += 1) {
      for (let x = 0; x < matrix[y].length; x += 1) {
        if (y+offsetY < this.matrix.length && matrix[y][x] !== 0) {
          this.matrix[y + offsetY][x + offsetX] = matrix[y][x];
        }
      }
    }
  }

}

export default Stack;
