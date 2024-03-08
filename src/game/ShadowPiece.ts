import FallingPiece from './FallingPiece';
import Piece from './Piece';
import Stack from './Stack';

class ShadowPiece extends Piece {
  offsetY: number;
  offsetX: number;
  constructor(public stack: Stack) {
    super();
    this.offsetY = 0;
    this.offsetX = 12 / 2 - 2;
  }

  drop(activePiece: FallingPiece) {
    this.matrix = activePiece.matrix;
    this.offsetX = activePiece.offsetX;
    this.offsetY = activePiece.offsetY;

    while (!this.stack.stackCollision(this.matrix, this.offsetY, this.offsetX)) {
      this.offsetY += 1;
    }
    this.offsetY -= 1;
  }
}

export default ShadowPiece;
