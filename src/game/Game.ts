import { cloneDeep } from 'lodash';
import FallingPiece from './FallingPiece';
import Stack from './Stack';
import ShadowPiece from './ShadowPiece';
import DatabaseService from '../utils/DatabaseService';
import { gameOverMenu, pauseMenu, submitNewScore } from '../components/Menu';
import { createPieceMatrix, get, iterMatrix } from '../utils';
import { COLORS } from '../utils/constants';
import Piece from './Piece';

class Game {
  canvas: HTMLCanvasElement;

  ctx: CanvasRenderingContext2D;

  waitingPieceCanvas: HTMLCanvasElement;

  waitingPieceCtx: CanvasRenderingContext2D;

  holdPieceCanvas: HTMLCanvasElement;

  holdPieceCtx: CanvasRenderingContext2D;

  canHold: boolean;

  isGamePaused: boolean;

  stack: Stack;

  activePiece: FallingPiece;

  waitingPiece: Piece;

  holdPiece: Piece | null;

  shadowPiece: ShadowPiece;

  lastTime: number;

  loopCounter: number;

  dropInterval: number;

  score: number;

  constructor() {
    this.canvas = get<HTMLCanvasElement>('#tetris');
    this.ctx = this.canvas.getContext('2d')!;

    this.waitingPieceCanvas = get<HTMLCanvasElement>('#next');
    this.waitingPieceCtx = this.waitingPieceCanvas.getContext('2d')!;

    this.holdPieceCanvas = get<HTMLCanvasElement>('#hold');
    this.holdPieceCtx = this.holdPieceCanvas.getContext('2d')!;

    this.canHold = true;
    this.isGamePaused = false;

    this.ctx.scale(20, 20);
    this.waitingPieceCtx.scale(20, 20);
    this.holdPieceCtx.scale(20, 20);
    this.score = 0;

    this.stack = new Stack();
    this.activePiece = new FallingPiece(this.stack);
    this.waitingPiece = Piece.createRandomPiece();
    this.shadowPiece = new ShadowPiece(this.stack);

    this.holdPiece = null;
    this.lastTime = 0;
    this.loopCounter = 0;
    this.dropInterval = 1000;
    this.setEvents();
  }

  animate(time = 0): void {
    if (this.isGamePaused === true) return;
    const deltaTime = time - this.lastTime;
    this.lastTime = time;
    this.loopCounter += deltaTime;
    if (this.loopCounter > this.dropInterval) {
      this.dropHandler();
    }
    this.draw();
    requestAnimationFrame(this.animate.bind(this));
  }

  dropHandler() {
    if (this.activePiece.softDrop()) {
      this.stack.merge(
        this.activePiece.matrix,
        this.activePiece.offsetY,
        this.activePiece.offsetX,
      );

      this.activePiece.updatePiece(this.waitingPiece);
      this.waitingPiece = Piece.createRandomPiece();

      this.updateScore(this.stack.removeLines());
      if (
        this.stack.stackCollision(
          this.activePiece.matrix,
          this.activePiece.offsetY,
          this.activePiece.offsetX,
        )
      ) {
        this.gameover();
      }
      this.canHold = true;
    }
    this.shadowPiece.drop(this.activePiece);
    this.loopCounter = 0;
  }

  draw(): void {
    // next piece
    this.waitingPieceCtx.fillStyle = '#000';
    this.waitingPieceCtx.fillRect(
      0,
      0,
      this.waitingPieceCanvas.width,
      this.waitingPieceCanvas.height,
    );
    const temp = createPieceMatrix(this.waitingPiece.pieceType!);
    iterMatrix(temp, (y, x) => {
      this.waitingPieceCtx.fillStyle = COLORS[this.waitingPiece.matrix[y][x] - 1];
      this.waitingPieceCtx.fillRect(x + 2.5, y + 2, 1, 1);
      this.waitingPieceCtx.lineWidth = 0.1;
      this.waitingPieceCtx.strokeStyle = 'black';
      this.waitingPieceCtx.strokeRect(x + 2.5, y + 2, 1, 1);
    });

    // hold piece
    this.holdPieceCtx.fillStyle = '#000';
    this.holdPieceCtx.fillRect(
      0,
      0,
      this.holdPieceCanvas.width,
      this.holdPieceCanvas.height,
    );
    if (this.holdPiece) {
      const temp2 = createPieceMatrix(this.holdPiece.pieceType!);
      iterMatrix(temp2, (y, x) => {
        this.holdPieceCtx.fillStyle = COLORS[temp2[y][x] - 1];
        this.holdPieceCtx.fillRect(x + 2.5, y + 2, 1, 1);
        this.holdPieceCtx.lineWidth = 0.1;
        this.holdPieceCtx.strokeStyle = 'black';
        this.holdPieceCtx.strokeRect(x + 2.5, y + 2, 1, 1);
      });
    }

    // main canvas black bg
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // shadow
    iterMatrix(this.shadowPiece.matrix, (y, x) => {
      const { offsetY, offsetX } = this.shadowPiece;
      this.ctx.clearRect(x + offsetX, y + offsetY, 1, 1);
      this.ctx.rect(x + offsetX, y + offsetY, 1, 1);
    });

    // stack
    iterMatrix(this.stack.matrix, (y, x) => {
      const { matrix } = this.stack;

      this.ctx.fillStyle = COLORS[matrix[y][x] - 1];
      this.ctx.fillRect(x, y, 1, 1);

      this.ctx.lineWidth = 0.1;
      this.ctx.strokeStyle = 'black';
      this.ctx.strokeRect(x, y, 1, 1);
    });

    // activePiece
    iterMatrix(this.activePiece.matrix, (y, x) => {
      const { matrix, offsetY, offsetX } = this.activePiece;

      this.ctx.fillStyle = COLORS[matrix[y][x] - 1];
      this.ctx.fillRect(x + offsetX, y + offsetY, 1, 1);

      this.ctx.lineWidth = 0.1;
      this.ctx.strokeStyle = 'black';
      this.ctx.strokeRect(x + offsetX, y + offsetY, 1, 1);
    });
  }

  setEvents(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.toggleGamePause();
        pauseMenu(this.isGamePaused);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (this.isGamePaused === true && event.key !== 'Escape') {
        return;
      }
      if (event.key === 'Escape') {
        this.toggleGamePause();
        pauseMenu(this.isGamePaused);
      } else if (event.key === 'ArrowDown') {
        this.dropHandler();
      } else if (event.key === 'ArrowLeft') {
        this.activePiece.goLeft();
      } else if (event.key === 'ArrowRight') {
        this.activePiece.goRight();
      } else if (event.key === 'ArrowUp') {
        this.activePiece.rotateRight();
      } else if (event.key === ' ') {
        this.activePiece.hardDrop(this.shadowPiece.offsetY);
        this.dropHandler();
      } else if (event.key === 'Shift') {
        if (this.holdPiece === null) {
          // hold = active, active = next, next = new
          this.holdPiece = new Piece();
          this.holdPiece.updatePiece(this.activePiece);
          this.activePiece.updatePiece(this.waitingPiece);
          this.waitingPiece = Piece.createRandomPiece();
        } else if (this.canHold) {
          // holdPiece <-> activePiece
          const temp = cloneDeep(this.holdPiece);
          this.holdPiece.updatePiece(this.activePiece);
          this.activePiece.updatePiece(temp);
        }
        this.canHold = false;
      }
      this.shadowPiece.drop(this.activePiece);
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

    // restart or play again
    restartButton.addEventListener('click', () => {
      this.stack.emptyStack();
      this.updateScore(-1);
      this.toggleGamePause();
      this.holdPiece = null;
      get('#menu').style.display = 'none';
    });
  }

  toggleGamePause() {
    this.isGamePaused = !this.isGamePaused;
    if (this.isGamePaused === false) {
      this.animate();
    }
  }

  updateScore(newScore: number) {
    if (newScore === -1) {
      this.score = 0;
      return;
    }
    this.score += newScore;
    get('#score').innerText = this.score.toString();
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
}

export default Game;
