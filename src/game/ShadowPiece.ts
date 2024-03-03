import Piece from './Piece';

class ShadowPiece {
  offsetX: number;

  offsetY: number;

  constructor(public activePiece: Piece, public ctx: CanvasRenderingContext2D) {
    this.offsetX = 12 / 2 - 2;
    this.offsetY = 0;
    this.expectedDrop();
  }

  update(offsetX: number) {
    this.offsetX = offsetX;
    this.expectedDrop();
  }

  expectedDrop() {
    this.offsetY = this.activePiece.offsetY;
    while (this.stackCollision() === false) {
      this.offsetY += 1;
    }
    this.offsetY -= 1;
  }

  stackCollision() {
    const { pieceMatrix } = this.activePiece;
    const { stackMatrix } = this.activePiece;
    // returns true if we're in a collision with the bottom wall or the current stack
    for (let y = 0; y < pieceMatrix.length; y += 1) {
      for (let x = 0; x < pieceMatrix[y].length; x += 1) {
        if (pieceMatrix[y][x] !== 0) {
          const realx = this.offsetX + x;
          const realy = this.offsetY + y;
          // check if we are colliding with the bottom wall
          if (realy >= stackMatrix.length) {
            return true;
          }
          // check if we are colliding with the existing stack
          if (stackMatrix[realy][realx] !== 0) {
            return true;
          }
        }
      }
    }
    return false;
  }

  draw() {
    const { pieceMatrix } = this.activePiece;
    this.ctx.lineWidth = 0.1;
    for (let y = 0; y < pieceMatrix.length; y += 1) {
      for (let x = 0; x < pieceMatrix[y].length; x += 1) {
        if (pieceMatrix[y][x] !== 0) {
          this.ctx.clearRect(x + this.offsetX, y + this.offsetY, 1, 1);
          this.ctx.rect(x + this.offsetX, y + this.offsetY, 1, 1);
        }
      }
    }
  }
}

export default ShadowPiece;
