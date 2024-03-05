import FallingPiece from './FallingPiece';
import Stack from './Stack';
import ShadowPiece from './ShadowPiece';
import DatabaseService from '../utils/DatabaseService';
import { gameOverMenu, pauseMenu, submitNewScore } from '../components/Menu';
import { COLORS, get } from '../utils';

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

  activePiece: FallingPiece;

  waitingPiece: FallingPiece;

  holdPiece: FallingPiece | null;

  shadowPiece: ShadowPiece;

  lastTime: number;

  dropCounter: number;

  dropInterval: number;

  score: number;

  constructor() {
    this.canvas = get<HTMLCanvasElement>('#tetris');
    this.ctx = this.canvas.getContext('2d')!;

    this.waitingPieceCanvas = get<HTMLCanvasElement>('#next');
    this.waitingPieceCtx = this.waitingPieceCanvas.getContext('2d')!;

    this.holdPieceCanvas = get<HTMLCanvasElement>('#hold');
    this.holdPieceCtx = this.holdPieceCanvas.getContext('2d')!;
    this.isHolding = false;
    this.isGamePaused = false;

    this.ctx.scale(20, 20);
    this.waitingPieceCtx.scale(20, 20);
    this.holdPieceCtx.scale(20, 20);
    this.score = 0;
    
    this.stack = new Stack();
    this.activePiece = new FallingPiece(this.stack);
    this.waitingPiece = new FallingPiece(this.stack);
    this.shadowPiece = new ShadowPiece(this.stack);

    this.holdPiece = null;
    this.lastTime = 0;
    this.dropCounter = 0;
    this.dropInterval = 1000;
    this.setEvents();
  }

  dropHandler() {
    if (this.activePiece.softDrop()) {
      this.stack.merge(this.activePiece);
      this.activePiece = this.waitingPiece;
      this.waitingPiece = new FallingPiece(this.stack);
      this.updateScore(this.stack.removeLines());
      if (this.stack.stackCollision(this.activePiece)) {
        this.gameover();
      }
      this.isHolding = false;
    }
    this.shadowPiece.drop(this.activePiece);
    this.dropCounter = 0;
  }

  async gameover() {
    this.toggleGamePause();
    let headingText = 'Game Over';
    let isHighScore = false;
    const message = `You Scored ${this.score}`;
    const highscores = await DatabaseService.fetchHighScores();
    if (
      highscores.length === 0
			|| this.score > highscores[highscores.length - 1].score
    ) {
      headingText = 'Congrats! New HighScore';
      isHighScore = true;
    } else {
      this.updateScore(-1);
    }

    gameOverMenu(isHighScore, headingText, message);
  }

  setEvents(): void {
    document.addEventListener('keydown', (event) => {
      if (this.isGamePaused === true && event.key !== 'Escape') {
        return;
      }
      if (event.key === 'ArrowDown') {
        this.dropHandler();
      } else if (event.key === 'ArrowLeft') {
        this.activePiece.goLeft();
        this.shadowPiece.drop(this.activePiece);
      } else if (event.key === 'ArrowRight') {
        this.activePiece.goRight();
        this.shadowPiece.drop(this.activePiece);
      } else if (event.key === 'ArrowUp') {
        this.activePiece.rotateRight();
        this.shadowPiece.drop(this.activePiece);
      } else if (event.key === ' ') {
        this.activePiece.hardDrop(this.shadowPiece.offsetY);
        this.dropHandler();
      } else if (event.key === 'Shift') {
        if (this.holdPiece === null) {
          this.holdPiece = this.activePiece;
          this.holdPiece.offsetY = 0;
          this.holdPiece.offsetX = 12 / 2 - 2;
          this.activePiece = this.waitingPiece;
          this.waitingPiece = new FallingPiece(this.stack);
          this.shadowPiece.drop(this.activePiece);
          this.isHolding = true;
        } else if (this.isHolding === false) {
          const tempPiece = this.activePiece;
          this.activePiece = this.holdPiece;
          this.holdPiece = tempPiece;
          this.holdPiece.offsetY = 0;
          this.holdPiece.offsetX = 12 / 2 - 2;
          this.shadowPiece.drop(this.activePiece);
          this.isHolding = true;
        }
      } else if (event.key === 'Escape') {
        this.toggleGamePause();
        pauseMenu(this.isGamePaused);
      }
    });

    const playButton = get('#play');
    const pauseButton = get('#pause');
    const submitScoreButton = get('#submitScore');
    const restartButton = get('#restart');

    playButton.addEventListener('click', () => {
      this.toggleGamePause();
      pauseMenu(this.isGamePaused);
    });
    pauseButton.addEventListener('click', () => {
      this.toggleGamePause();
      pauseMenu(this.isGamePaused);
    });
    submitScoreButton.addEventListener('click', () => {
      submitNewScore(this.score);
    });
    restartButton.addEventListener('click', () => {
      this.stack.emptyStack();
      this.updateScore(-1);
      this.toggleGamePause();
      get('#menu').style.display = 'none';
    });
  }

  toggleGamePause() {
    this.isGamePaused = !this.isGamePaused;
    if (this.isGamePaused === false) {
      this.animate();
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
      this.waitingPieceCanvas.height,
    );
    this.drawSide(this.waitingPieceCtx, this.waitingPiece.matrix);

    // hold piece black bg
    this.holdPieceCtx.fillStyle = '#000';
    this.holdPieceCtx.fillRect(
      0,
      0,
      this.holdPieceCanvas.width,
      this.holdPieceCanvas.height,
    );
    if (this.holdPiece && this.holdPiece.matrix) {
      this.drawSide(this.holdPieceCtx, this.holdPiece.matrix);
    }
    
    this.drawMatrix(this.stack.matrix);
    this.drawMatrix(
      this.activePiece.matrix,
      this.activePiece.offsetX,
      this.activePiece.offsetY,
    );
    this.drawMatrix(
      this.shadowPiece.matrix,
      this.shadowPiece.offsetX,
      this.shadowPiece.offsetY,
      true
    );
  }

  drawSide(ctx: CanvasRenderingContext2D, matrix: number[][]) {
    for (let y = 0; y < matrix.length; y += 1) {
      for (let x = 0; x < matrix[y].length; x += 1) {
        if (matrix[y][x] !== 0) {
          ctx.fillStyle = COLORS[matrix[y][x] - 1];
          ctx.fillRect(x + 2.5, y + 2, 1, 1);
        }
      }
    }
  }

  drawMatrix(matrix: number[][], offsetX = 0, offsetY = 0, isShadow = false): void {
    for (let y = 0; y < matrix.length; y += 1) {
      for (let x = 0; x < matrix[y].length; x += 1) {
        if (matrix[y][x] !== 0) {
          if (isShadow) {
            this.ctx.clearRect(x + offsetX, y + offsetY, 1, 1);
            this.ctx.rect(x + offsetX, y + offsetY, 1, 1);
          } else {
            // draw shape
            this.ctx.fillStyle = COLORS[matrix[y][x] - 1];
            this.ctx.fillRect(x + offsetX, y + offsetY, 1, 1);

            // draw border
            this.ctx.lineWidth = 0.1;
            this.ctx.strokeStyle = 'black';
            this.ctx.strokeRect(x + offsetX, y + offsetY, 1, 1);
          }
          
        }
      }
    }
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
    get('#score').innerText = this.score.toString();
  }

}

export default Game;
