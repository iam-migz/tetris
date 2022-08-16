import Piece from './Piece';
import Stack from './Stack';
import ShadowPiece from './ShadowPiece';
class Game {
  private _canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  activePiece: Piece;
  waitingPiece: Piece;
  shadowPiece: ShadowPiece;
  stack: Stack;
  lastTime: number;
  dropCounter: number;
  dropInterval: number;
  colors: string[];
  score: number;

  constructor() {
    this._canvas = document.getElementById('tetris') as HTMLCanvasElement;
    this.ctx = this._canvas.getContext('2d')!;
    this.ctx.scale(20, 20);
    this.colors = [
      '#FF0D72',
      '#0DC2FF',
      '#0DFF72',
      '#F538FF',
      '#FF8E0D',
      '#FFE138',
      '#3877FF',
    ];
    this.score = 0;
    this.updateScore(0);
    this.stack = new Stack();
    this.activePiece = new Piece(this.stack.stackMatrix);
    this.shadowPiece = new ShadowPiece(
      this.activePiece.pieceMatrix,
      this.stack.stackMatrix,
      this.ctx
    );
    this.waitingPiece = new Piece(this.stack.stackMatrix);
    this.activePiece.begin();
    console.log(this.activePiece.pieceMatrix);
    console.log(this.waitingPiece.pieceMatrix);

    this.setMovements();
    this.lastTime = 0;
    this.dropCounter = 0;
    this.dropInterval = 1000;
    this.update();
  }
  dropHandler() {
    if (this.activePiece.softDrop()) {
      this.merge();
      this.activePiece = this.waitingPiece;
      this.waitingPiece = new Piece(this.stack.stackMatrix);
      this.activePiece.begin();
      this.shadowPiece.pieceMatrix = [...this.activePiece.pieceMatrix];
      this.updateScore(this.stack.removeLines());
      if (this.activePiece.stackCollision()) {
        this.score = 0;
        this.updateScore(0);
        this.stack.gameOver();
      }
      this.shadowPiece.update(this.activePiece.offsetX);
    }
    this.dropCounter = 0;
  }
  setMovements(): void {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        this.dropHandler();
      } else if (event.key === 'ArrowLeft') {
        this.activePiece.GoLeft();
        this.shadowPiece.update(this.activePiece.offsetX);
      } else if (event.key === 'ArrowRight') {
        this.activePiece.GoRight();
        this.shadowPiece.update(this.activePiece.offsetX);
      } else if (event.key === 'ArrowUp') {
        this.activePiece.rotateRight();
        this.shadowPiece.update(this.activePiece.offsetX);
      } else if (event.key === ' ') {
        this.activePiece.hardDrop(this.shadowPiece.offsetY);
        this.dropHandler();
      }
    });
  }
  merge() {
    // merge stackMatrix & pieceMatrix
    for (let y = 0; y < this.activePiece.pieceMatrix.length; y++) {
      for (let x = 0; x < this.activePiece.pieceMatrix[y].length; x++) {
        if (this.activePiece.pieceMatrix[y][x] !== 0) {
          this.stack.stackMatrix[y + this.activePiece.offsetY][
            x + this.activePiece.offsetX
          ] = this.activePiece.pieceMatrix[y][x];
        }
      }
    }
  }
  drawMatrix(matrix: number[][], offsetX = 0, offsetY = 0): void {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (matrix[y][x] !== 0) {
          this.ctx.fillStyle = this.colors[matrix[y][x] - 1];
          this.ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
        }
      }
    }
  }
  draw(): void {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
    this.shadowPiece.draw();

    this.drawMatrix(this.stack.stackMatrix);
    this.drawMatrix(
      this.activePiece.pieceMatrix,
      this.activePiece.offsetX,
      this.activePiece.offsetY
    );
  }
  update(time = 0): void {
    const deltaTime = time - this.lastTime;
    this.lastTime = time;
    this.dropCounter += deltaTime;
    if (this.dropCounter > this.dropInterval) {
      this.dropHandler();
    }
    this.draw();
    requestAnimationFrame(this.update.bind(this));
  }
  updateScore(newScore: number) {
    this.score += newScore;
    let score = document.getElementById('score')!;
    score.innerText = this.score.toString();
  }
}

export default Game;
