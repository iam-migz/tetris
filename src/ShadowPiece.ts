class ShadowPiece {
  offsetX: number;
  offsetY: number;
  constructor(
    public pieceMatrix: number[][],
    public stackMatrix: number[][],
    public ctx: CanvasRenderingContext2D
  ) {
    this.offsetX = 12 / 2 - 2;
    this.offsetY = 0;
    this.expectedDrop();
  }
  update(offsetX: number) {
    console.table(this.pieceMatrix);
    this.offsetX = offsetX;
    this.expectedDrop();
  }
  expectedDrop() {
    this.offsetY = 0;
    while (this.stackCollision() === false) {
      this.offsetY++;
    }
    this.offsetY--;
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
  draw() {
    this.ctx.lineWidth = 0.1;
    for (let y = 0; y < this.pieceMatrix.length; y++) {
      for (let x = 0; x < this.pieceMatrix[y].length; x++) {
        if (this.pieceMatrix[y][x] !== 0) {
          this.ctx.clearRect(x + this.offsetX, y + this.offsetY, 1, 1);
          this.ctx.rect(x + this.offsetX, y + this.offsetY, 1, 1);
        }
      }
    }
  }
}

export default ShadowPiece;
