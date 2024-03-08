import { random } from 'lodash';
import { PieceType, PieceTypeArray } from '../utils/constants';
import { createPieceMatrix } from '../utils';

class Piece {
  matrix: number[][];

  /**
   * since matrix will be changed because of rotation
   * this is needed to get the original orientation of the Piece
   * */
  pieceType: PieceType | null;

  constructor() {
    this.matrix = [];
    this.pieceType = null;
  }

  updatePiece(piece: Piece) {
    this.matrix = piece.matrix;
    this.pieceType = piece.pieceType;
  }

  static createRandomPiece() {
    const rand = random(0, PieceTypeArray.length - 1, false);
    const piece = new Piece();
    piece.pieceType = PieceTypeArray[rand];
    piece.matrix = createPieceMatrix(piece.pieceType);
    return piece;
  }
}

export default Piece;
