type PieceType = 'O' | 'I' | 'S' | 'Z' | 'L' | 'J' | 'T';

class Piece {
  waiting: boolean;
  offsetX: number;
  offsetY: number;
  pieceMatrix: number[][];

  constructor(public stackMatrix: number[][]) {
    this.waiting = true;
    this.offsetX = 12 / 2 - 2;
    this.offsetY = 0;
    this.pieceMatrix = [];
    this.getRandomPiece();
  }
  begin() {
    this.waiting = false;
  }
  getRandomPiece() {
    const randomPieceIndex = Math.round(Math.random() * 6);
    const pieces: PieceType[] = ['O', 'I', 'S', 'Z', 'L', 'J', 'T'];
    this.pieceMatrix = this.createPiece(pieces[randomPieceIndex]);
  }
  hardDrop(offsetY: number) {
    this.offsetY = offsetY;
    return true;
  }
  softDrop(): boolean {
    this.offsetY++;
    if (this.stackCollision()) {
      this.offsetY--;
      return true;
    }
    return false;
  }
  GoRight() {
    this.offsetX++;
    if (this.rightWallCollision()) {
      this.offsetX--;
      return;
    }
    if (this.stackCollision()) {
      this.offsetX--;
    }
  }
  GoLeft() {
    this.offsetX--;
    if (this.leftWallCollision()) {
      this.offsetX++;
      return;
    }
    if (this.stackCollision()) {
      this.offsetX++;
    }
  }
  rotateRight() {
    let tempMatrix: number[][] = [];

    // copy matrix
    for (let y = 0; y < this.pieceMatrix.length; y++) {
      tempMatrix[y] = [...this.pieceMatrix[y]];
    }
    // rotation
    let size_y = this.pieceMatrix.length - 1;
    let size_x = this.pieceMatrix[0].length - 1;
    for (let y = 0; y <= size_y; y++) {
      for (let x = 0; x <= size_x; x++) {
        this.pieceMatrix[x][size_y - y] = tempMatrix[y][x];
      }
    }
    // check collisions
    while (this.leftWallCollision()) {
      this.offsetX++;
    }
    while (this.rightWallCollision()) {
      this.offsetX--;
    }
    if (this.stackCollision()) {
      // revert
      for (let y = 0; y < this.pieceMatrix.length; y++) {
        this.pieceMatrix[y] = [...tempMatrix[y]];
      }
    }
  }
  leftWallCollision() {
    for (let y = 0; y < this.pieceMatrix.length; y++) {
      for (let x = 0; x < this.pieceMatrix[y].length; x++) {
        if (this.pieceMatrix[y][x] !== 0) {
          let realX = this.offsetX + x;
          if (realX < 0) {
            return true;
          }
        }
      }
    }
    return false;
  }
  rightWallCollision() {
    for (let y = 0; y < this.pieceMatrix.length; y++) {
      for (let x = 0; x < this.pieceMatrix[y].length; x++) {
        if (this.pieceMatrix[y][x] !== 0) {
          let realX = this.offsetX + x;
          let stackWidth = this.stackMatrix[0].length;
          if (realX >= stackWidth) {
            return true;
          }
        }
      }
    }
    return false;
  }
  stackCollision() {
    // returns true if we're in a collision with the bottom wall or the current stack
    for (let y = 0; y < this.pieceMatrix.length; y++) {
      for (let x = 0; x < this.pieceMatrix[y].length; x++) {
        if (this.pieceMatrix[y][x] !== 0) {
          let realx = this.offsetX + x;
          let realy = this.offsetY + y;
          // check if we are colliding with the bottom wall
          if (realy >= this.stackMatrix.length) {
            console.log('wall collision');
            return true;
          }
          // check if we are colliding with the existing stack
          if (this.stackMatrix[realy][realx] !== 0) {
            console.log('stack collision');
            return true;
          }
        }
      }
    }
    return false;
  }
  createPiece(type: PieceType): number[][] {
    switch (type) {
      case 'T':
        return [
          [0, 0, 0],
          [1, 1, 1],
          [0, 1, 0],
        ];
      case 'O':
        return [
          [2, 2],
          [2, 2],
        ];
      case 'L':
        return [
          [0, 3, 0],
          [0, 3, 0],
          [0, 3, 3],
        ];
      case 'J':
        return [
          [0, 4, 0],
          [0, 4, 0],
          [4, 4, 0],
        ];
      case 'I':
        return [
          [0, 5, 0, 0],
          [0, 5, 0, 0],
          [0, 5, 0, 0],
          [0, 5, 0, 0],
        ];
      case 'S':
        return [
          [0, 6, 6],
          [6, 6, 0],
          [0, 0, 0],
        ];
      case 'Z':
        return [
          [7, 7, 0],
          [0, 7, 7],
          [0, 0, 0],
        ];
    }
  }
}

export default Piece;
