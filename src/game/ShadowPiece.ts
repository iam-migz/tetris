import Piece from './Piece';
import Stack from './Stack';

class ShadowPiece extends Piece {
  constructor(public stack: Stack) {
    super();
  }

  drop(activePiece: Piece) {
    this.matrix = activePiece.matrix;
    this.offsetX = activePiece.offsetX;
    this.offsetY = activePiece.offsetY;

    while (!this.stack.stackCollision(this)) {
      this.offsetY += 1;
    }
    this.offsetY -= 1;
  }
}

export default ShadowPiece;
