import { PIECE_TYPE, tetrisPiece } from '../utils';
import Piece from './Piece';
import Stack from './Stack';

/**
 * Falling Piece
 */
class FallingPiece extends Piece {

  constructor(public stack: Stack) {
    super();
    this.createRandomPiece();
  }

  hardDrop(offsetY: number) {
    this.offsetY = offsetY;
    return true;
  }

  /**
   *
   * @returns true if it collided with stack
   */
  softDrop(): boolean {
    this.offsetY += 1;
    if (this.stack.stackCollision(this)) {
      this.offsetY -= 1;
      return true;
    }
    return false;
  }

  goRight() {
    this.offsetX += 1;
    if (this.rightWallCollision()) {
      this.offsetX -= 1;
      return;
    }
    if (this.stack.stackCollision(this)) {
      this.offsetX -= 1;
    }
  }

  goLeft() {
    this.offsetX -= 1;
    if (this.leftWallCollision()) {
      this.offsetX += 1;
      return;
    }
    if (this.stack.stackCollision(this)) {
      this.offsetX += 1;
    }
  }

  rotateRight() {
    const tempMatrix: number[][] = [];

    // copy matrix
    for (let y = 0; y < this.matrix.length; y += 1) {
      tempMatrix[y] = [...this.matrix[y]];
    }
    // rotation
    const SIZE_Y = this.matrix.length - 1;
    const SIZE_X = this.matrix[0].length - 1;
    for (let y = 0; y <= SIZE_Y; y += 1) {
      for (let x = 0; x <= SIZE_X; x += 1) {
        this.matrix[x][SIZE_Y - y] = tempMatrix[y][x];
      }
    }
    // check collisions
    while (this.leftWallCollision()) {
      this.offsetX += 1;
    }
    while (this.rightWallCollision()) {
      this.offsetX -= 1;
    }
    if (this.stack.stackCollision(this)) {
      // revert
      for (let y = 0; y < this.matrix.length; y += 1) {
        this.matrix[y] = [...tempMatrix[y]];
      }
    }
  }

  leftWallCollision() {
    for (let y = 0; y < this.matrix.length; y += 1) {
      for (let x = 0; x < this.matrix[y].length; x += 1) {
        if (this.matrix[y][x] !== 0) {
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
    for (let y = 0; y < this.matrix.length; y += 1) {
      for (let x = 0; x < this.matrix[y].length; x += 1) {
        if (this.matrix[y][x] !== 0) {
          const realX = this.offsetX + x;
          const stackWidth = this.stack.matrix[0].length;
          if (realX >= stackWidth) {
            return true;
          }
        }
      }
    }
    return false;
  }

  createRandomPiece() {
    const TETRIS_PIECES = Object.values(PIECE_TYPE);
    const random = Math.round(Math.random() * (TETRIS_PIECES.length-1));
    this.matrix = tetrisPiece[TETRIS_PIECES[random]]
  }
}

export default FallingPiece;
