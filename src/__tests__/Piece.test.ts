import FallingPiece from "../game/FallingPiece";
import Piece from "../game/Piece";
import Stack from '../game/Stack';

describe('Piece', () => {
  let piece: Piece;
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack();
    piece = new Piece();
  });

  test('case 1: stackCollision not hit', () => {
    piece.matrix = [
      [1,1,1],
      [0,0,0],
      [0,0,0],
    ]
    expect(stack.stackCollision(piece)).toBeFalsy()
  });

  // test('case 2: stackCollision hit', () => {
  //   const fallingPiece = new FallingPiece(stack);
  //   fallingPiece.offsetY = stack.matrix.length-2;
  //   expect(stack.stackCollision(fallingPiece)).toBeTruthy()
  // });



});