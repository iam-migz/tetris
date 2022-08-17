import Piece from './Piece';
import Stack from './Stack';
import ShadowPiece from './ShadowPiece';
class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  waitingPieceCanvas: HTMLCanvasElement;
  waitingPieceCtx: CanvasRenderingContext2D;

  holdPieceCanvas: HTMLCanvasElement;
  holdPieceCtx: CanvasRenderingContext2D;
  isHolding: boolean;
  isGamePaused: boolean;

  stack: Stack;
  activePiece: Piece;
  waitingPiece: Piece;
  holdPiece: Piece | null;
  shadowPiece: ShadowPiece;

  lastTime: number;
  dropCounter: number;
  dropInterval: number;
  colors: string[];
  score: number;

  constructor() {
    this.canvas = document.getElementById('tetris') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;

    this.waitingPieceCanvas = document.getElementById(
      'next'
    ) as HTMLCanvasElement;
    this.waitingPieceCtx = this.waitingPieceCanvas.getContext('2d')!;

    this.holdPieceCanvas = document.getElementById('hold') as HTMLCanvasElement;
    this.holdPieceCtx = this.holdPieceCanvas.getContext('2d')!;
    this.isHolding = false;
    this.isGamePaused = false;

    this.ctx.scale(20, 20);
    this.waitingPieceCtx.scale(20, 20);
    this.holdPieceCtx.scale(20, 20);
    this.colors = [
      'purple',
      'yellow',
      'orange',
      'blue',
      'cyan',
      'green',
      'red',
    ];
    this.score = 0;
    this.updateScore(0);
    this.stack = new Stack();
    this.activePiece = new Piece(this.stack.stackMatrix);
    this.shadowPiece = new ShadowPiece(this.activePiece, this.ctx);
    this.waitingPiece = new Piece(this.stack.stackMatrix);
    this.holdPiece = null;
    this.activePiece.begin();

    this.setMovements();
    this.lastTime = 0;
    this.dropCounter = 0;
    this.dropInterval = 1000;
    this.animate();
  }
  dropHandler() {
    if (this.activePiece.softDrop()) {
      this.merge();
      this.activePiece = this.waitingPiece;
      this.waitingPiece = new Piece(this.stack.stackMatrix);
      this.activePiece.begin();
      this.shadowPiece.activePiece = this.activePiece;
      this.updateScore(this.stack.removeLines());
      if (this.activePiece.stackCollision()) {
        this.gameover();
      }
      this.shadowPiece.update(this.activePiece.offsetX);
      this.isHolding = false;
    }
    this.dropCounter = 0;
  }
  gameover() {
    this.score = 0;
    this.updateScore(0);
    this.stack.emptyStack();
    let menu = document.querySelector('#overlay') as HTMLElement;
    let heading = menu.querySelector('#overlay-heading') as HTMLElement;
    let playButton = document.querySelector('#play') as HTMLButtonElement;
    this.toggleGamePause();
    heading.innerText = 'Game Over :(';
    menu.style.display = 'block';
    playButton.innerText = 'play again';
  }
  setMovements(): void {
    document.addEventListener('keydown', (event) => {
      if (this.isGamePaused === true && event.key !== 'Escape') {
        return;
      }
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
      } else if (event.key === 'Shift') {
        if (this.holdPiece === null) {
          this.holdPiece = this.activePiece;
          this.holdPiece.offsetY = 0;
          this.holdPiece.offsetX = 12 / 2 - 2;
          this.activePiece = this.waitingPiece;
          this.waitingPiece = new Piece(this.stack.stackMatrix);
          this.activePiece.begin();
          this.shadowPiece.activePiece = this.activePiece;
          this.shadowPiece.update(this.activePiece.offsetX);
          this.isHolding = true;
        } else if (this.isHolding === false) {
          let tempPiece = this.activePiece;
          this.activePiece = this.holdPiece;
          this.holdPiece = tempPiece;
          this.holdPiece.offsetY = 0;
          this.holdPiece.offsetX = 12 / 2 - 2;
          this.shadowPiece.activePiece = this.activePiece;
          this.shadowPiece.update(this.activePiece.offsetX);
          this.isHolding = true;
        }
      } else if (event.key === 'Escape') {
        this.toggleGamePause();
      }
    });
    let playButton = document.querySelector('#play') as HTMLButtonElement;
    let pauseButton = document.querySelector('#pause') as HTMLButtonElement;
    playButton.addEventListener('click', (event: Event) => {
      this.toggleGamePause();
    });
    pauseButton.addEventListener('click', (event: Event) => {
      this.toggleGamePause();
    });
  }
  toggleGamePause() {
    let menu = document.querySelector('#overlay') as HTMLElement;
    let heading = menu.querySelector('#overlay-heading') as HTMLElement;
    let startButton = document.querySelector('#start') as HTMLButtonElement;
    let playButton = document.querySelector('#play') as HTMLButtonElement;

    if (this.isGamePaused === true) {
      this.isGamePaused = false;
      menu.style.display = 'none';
      this.animate();
    } else {
      this.isGamePaused = true;
      menu.style.display = 'block';
      heading.innerText = 'Paused';
      startButton.style.display = 'none';
      playButton.style.display = 'block';
    }
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
    // tetris game black bg
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // next piece black bg
    this.waitingPieceCtx.fillStyle = '#000';
    this.waitingPieceCtx.fillRect(
      0,
      0,
      this.waitingPieceCanvas.width,
      this.waitingPieceCanvas.height
    );
    this.drawSide(this.waitingPieceCtx, this.waitingPiece.pieceMatrix);

    // hold piece black bg
    this.holdPieceCtx.fillStyle = '#000';
    this.holdPieceCtx.fillRect(
      0,
      0,
      this.holdPieceCanvas.width,
      this.holdPieceCanvas.height
    );
    if (this.holdPiece && this.holdPiece.pieceMatrix) {
      this.drawSide(this.holdPieceCtx, this.holdPiece.pieceMatrix);
    }

    this.shadowPiece.draw();

    this.drawMatrix(this.stack.stackMatrix);
    this.drawMatrix(
      this.activePiece.pieceMatrix,
      this.activePiece.offsetX,
      this.activePiece.offsetY
    );
  }
  animate(time = 0): void {
    if (this.isGamePaused === true) return;
    const deltaTime = time - this.lastTime;
    this.lastTime = time;
    this.dropCounter += deltaTime;
    if (this.dropCounter > this.dropInterval) {
      this.dropHandler();
    }
    this.draw();
    requestAnimationFrame(this.animate.bind(this));
  }
  updateScore(newScore: number) {
    this.score += newScore;
    let score = document.getElementById('score')!;
    score.innerText = this.score.toString();
  }
  drawSide(ctx: CanvasRenderingContext2D, matrix: number[][]) {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (matrix[y][x] !== 0) {
          ctx.fillStyle = this.colors[matrix[y][x] - 1];
          ctx.fillRect(x + 2.5, y + 2, 1, 1);
        }
      }
    }
  }
}

export default Game;
