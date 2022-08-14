/*
initialize: 
  1. create a random piece                      
  2. initialize the new position and matrix of the piece
  3. make it initialize waiting
  4. collisions
  5. player movements 
  6. draw based on position and matrix
*/
/*
  TODO
  --------------------
  1. PieceType should be in constructor

  Q. do i create a new instance of the Piece Object or keep the new one

*/
type PieceType = 'O' | 'I' | 'S' | 'Z' | 'L' | 'J' | 'T';

class Piece {
  waiting: boolean;
  offsetX: number;
  offsetY: number;
  pieceMatrix: boolean[][];
  colors: string[];

  constructor(
    public ctx: CanvasRenderingContext2D,
    public stackMatrix: boolean[][]
  ) {
    this.waiting = true;
    this.offsetX = 12 / 2 - 2;
    this.offsetY = 0;
    this.pieceMatrix = [];
    this.colors = [
      '',
      '#FF0D72',
      '#0DC2FF',
      '#0DFF72',
      '#F538FF',
      '#FF8E0D',
      '#FFE138',
      '#3877FF',
    ];
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
    }
  }
  GoLeft() {
    this.offsetX--;
    if (this.leftWallCollision()) {
      this.offsetX++;
    }
  }
  rotateRight() {
    let tempMatrix: boolean[][] = [];

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
        if (this.pieceMatrix[y][x] === true) {
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
        if (this.pieceMatrix[y][x] === true) {
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
        if (this.pieceMatrix[y][x] === true) {
          let realx = this.offsetX + x;
          let realy = this.offsetY + y;
          // check if we are colliding with the bottom wall
          if (realy >= this.stackMatrix.length) {
            console.log('wall collision');
            return true;
          }
          // check if we are colliding with the existing stack
          if (this.stackMatrix[realy][realx] === true) {
            console.log('stack collision');
            return true;
          }
        }
      }
    }
    return false;
  }
  createPiece(type: PieceType): boolean[][] {
    switch (type) {
      case 'T':
        return [
          [false, false, false],
          [true, true, true],
          [false, true, false],
        ];
      case 'O':
        return [
          [true, true],
          [true, true],
        ];
      case 'L':
        return [
          [false, true, false],
          [false, true, false],
          [false, true, true],
        ];
      case 'J':
        return [
          [false, true, false],
          [false, true, false],
          [true, true, false],
        ];
      case 'I':
        return [
          [false, true, false, false],
          [false, true, false, false],
          [false, true, false, false],
          [false, true, false, false],
        ];
      case 'S':
        return [
          [false, true, true],
          [true, true, false],
          [false, false, false],
        ];
      case 'Z':
        return [
          [true, true, false],
          [false, true, true],
          [false, false, false],
        ];
    }
  }

  drawPiece() {
    for (let y = 0; y < this.pieceMatrix.length; y++) {
      for (let x = 0; x < this.pieceMatrix[y].length; x++) {
        if (this.pieceMatrix[y][x]) {
          this.ctx.fillStyle = this.colors[y];
          this.ctx.fillRect(x + this.offsetX, y + this.offsetY, 1, 1);
        }
      }
    }
  }
}

export default Piece;
