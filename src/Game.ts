import Piece from './Piece';
import Stack from './Stack';
import ShadowPiece from './ShadowPiece';
import Menu from './Menu';
import DatabaseService from './DatabaseService';
import * as Helpers from "./Helpers";

class Game {
  menu: Menu;

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

  constructor(public databaseService: DatabaseService) {
    this.menu = new Menu();
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
    this.score = 7;
    this.stack = new Stack();
    this.activePiece = new Piece(this.stack.stackMatrix);
    this.shadowPiece = new ShadowPiece(this.activePiece, this.ctx);
    this.waitingPiece = new Piece(this.stack.stackMatrix);
    this.holdPiece = null;
    this.activePiece.begin();

    this.setEvents();
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
  async gameover() {
    this.toggleGamePause();
    let headingText = 'Game Over';
    let isHighScore = false;
    let message = `You Scored ${this.score}`;
    const highscores = await this.databaseService.fetchHighScores();
    if (
      highscores.length === 0 ||
      this.score > highscores[highscores.length - 1].score
    ) {
      headingText = 'Congrats! New HighScore';
      isHighScore = true;
    } else {
      this.updateScore(-1);
    }
    
    this.menu.gameOverMenu(isHighScore, headingText, message);
  }
  async submitNewScore() {
    const nameInput = document.querySelector('#name') as HTMLInputElement;
    this.menu.message.style.color = 'red';

    if (nameInput.value === '') {
      this.menu.message.innerText = 'name input empty';
      return;
    } else if (nameInput.value.length <= 3) {
      this.menu.message.innerText = 'name too small';
      return;
    } else if (nameInput.value.length > 10) {
      this.menu.message.innerText = 'name too big';
      return;
    }
    this.menu.message.style.color = 'white';
    this.menu.message.style.display = 'none';

    await this.databaseService.storeHighScore(nameInput.value, this.score);
    this.databaseService.fetchHighScores().then((highscores) => {
        Helpers.renderTopScores(highscores);
    });
    this.menu.nameInput.style.display = 'none';
    this.menu.submitScoreButton.style.display = 'none';
  }

  setEvents(): void {
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
        // improve this
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
        this.menu.pauseMenu(this.isGamePaused, 'Paused', 'Resume');
      }
    });
    let playButton = document.querySelector('#play') as HTMLButtonElement;
    let pauseButton = document.querySelector('#pause') as HTMLButtonElement;
    let submitScoreButton = document.querySelector(
      '#submitScore'
    ) as HTMLButtonElement;
    let restartButton = document.querySelector('#restart') as HTMLButtonElement;
    playButton.addEventListener('click', (event: Event) => {
      this.toggleGamePause();
      this.menu.pauseMenu(this.isGamePaused, 'Paused', 'Resume');
    });
    pauseButton.addEventListener('click', (event: Event) => {
      this.toggleGamePause();
      this.menu.pauseMenu(this.isGamePaused, 'Paused', 'Resume');
    });
    submitScoreButton.addEventListener('click', (event: Event) => {
      this.submitNewScore();
    });
    restartButton.addEventListener('click', (event: Event) => {
      this.stack.emptyStack();
      this.updateScore(-1);
      this.toggleGamePause();
      this.menu.menu.style.display = 'none';
    });
  }
  toggleGamePause() {
    this.isGamePaused = !this.isGamePaused;
    if (this.isGamePaused === false) {
      this.animate();
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
          this.ctx.strokeStyle = 'black';
          this.ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
          this.ctx.strokeRect(x + offsetX, y + offsetY, 1, 1);
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
    if (newScore === -1) {
      this.score = 0;
      return;
    }
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
