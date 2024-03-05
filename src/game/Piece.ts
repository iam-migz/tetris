class Piece {
  offsetX: number;

  offsetY: number;

  matrix: number[][];

  constructor() {
    this.offsetX = 12 / 2 - 2;
    this.offsetY = 0;
    this.matrix = [[]];
  }
}

export default Piece;
