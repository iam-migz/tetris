class Piece {
  waiting: boolean;

  offsetX: number;

  offsetY: number;

  pieceMatrix: number[][];

  pieces: string[];

  constructor(public stackMatrix: number[][]) {
    this.waiting = true;
    this.offsetX = 12 / 2 - 2;
    this.offsetY = 0;
    this.pieceMatrix = [];
    this.pieces = ['O', 'I', 'S', 'Z', 'L', 'J', 'T'];
    this.createRandomPiece();
  }

  begin() {
    this.waiting = false;
  }

  // getRandomPiece() {
  //   const randomPieceIndex = Math.round(Math.random() * 6);
  //   const pieces: PieceType[] = ['O', 'I', 'S', 'Z', 'L', 'J', 'T'];
  //   this.pieceMatrix = this.createPiece(pieces[randomPieceIndex]);
  // }

  hardDrop(offsetY: number) {
    this.offsetY = offsetY;
    return true;
  }

  softDrop(): boolean {
    this.offsetY += 1;
    if (this.stackCollision()) {
      this.offsetY -= 1;
      return true;
    }
    return false;
  }

  GoRight() {
    this.offsetX += 1;
    if (this.rightWallCollision()) {
      this.offsetX -= 1;
      return;
    }
    if (this.stackCollision()) {
      this.offsetX -= 1;
    }
  }

  GoLeft() {
    this.offsetX -= 1;
    if (this.leftWallCollision()) {
      this.offsetX += 1;
      return;
    }
    if (this.stackCollision()) {
      this.offsetX += 1;
    }
  }

  rotateRight() {
    const tempMatrix: number[][] = [];

    // copy matrix
    for (let y = 0; y < this.pieceMatrix.length; y += 1) {
      tempMatrix[y] = [...this.pieceMatrix[y]];
    }
    // rotation
    const SIZE_Y = this.pieceMatrix.length - 1;
    const SIZE_X = this.pieceMatrix[0].length - 1;
    for (let y = 0; y <= SIZE_Y; y += 1) {
      for (let x = 0; x <= SIZE_X; x += 1) {
        this.pieceMatrix[x][SIZE_Y - y] = tempMatrix[y][x];
      }
    }
    // check collisions
    while (this.leftWallCollision()) {
      this.offsetX += 1;
    }
    while (this.rightWallCollision()) {
      this.offsetX -= 1;
    }
    if (this.stackCollision()) {
      // revert
      for (let y = 0; y < this.pieceMatrix.length; y += 1) {
        this.pieceMatrix[y] = [...tempMatrix[y]];
      }
    }
  }

  leftWallCollision() {
    for (let y = 0; y < this.pieceMatrix.length; y += 1) {
      for (let x = 0; x < this.pieceMatrix[y].length; x += 1) {
        if (this.pieceMatrix[y][x] !== 0) {
          const realX = this.offsetX + x;
          if (realX < 0) {
            return true;
          }
        }
      }
    }
    return false;
  }

  rightWallCollision() {
    for (let y = 0; y < this.pieceMatrix.length; y += 1) {
      for (let x = 0; x < this.pieceMatrix[y].length; x += 1) {
        if (this.pieceMatrix[y][x] !== 0) {
          const realX = this.offsetX + x;
          const stackWidth = this.stackMatrix[0].length;
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
    for (let y = 0; y < this.pieceMatrix.length; y += 1) {
      for (let x = 0; x < this.pieceMatrix[y].length; x += 1) {
        if (this.pieceMatrix[y][x] !== 0) {
          const realx = this.offsetX + x;
          const realy = this.offsetY + y;
          // check if we are colliding with the bottom wall
          if (realy >= this.stackMatrix.length) {
            return true;
          }
          // check if we are colliding with the existing stack
          if (this.stackMatrix[realy][realx] !== 0) {
            return true;
          }
        }
      }
    }
    return false;
  }

  createRandomPiece(): number[][] {
    const randomPieceIndex = Math.round(Math.random() * 6);
    // this.pieceMatrix = this.createPiece(pieces[randomPieceIndex]);
    switch (this.pieces[randomPieceIndex]) {
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
      default:
        return [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ];
    }
  }
}

export default Piece;
