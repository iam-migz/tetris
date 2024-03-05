import Piece from '../game/Piece';
import Stack from '../game/Stack';
import { PIECE_TYPE, tetrisPiece } from '../utils';

describe('Stack', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack();
  });

  test('test createMatrix', () => {
    /**
     * matrix(rows = y, cols = x)
     * matrix(2,3)
     * [[0,0,0],
     *  [0,0,0]]
     */
    stack.matrix = [];
    stack.createMatrix(2, 3);
    expect(stack.matrix.length).toBe(2);
    expect(stack.matrix[0].length).toBe(3);
  });

  test('test emptyStack', () => {
    stack.emptyStack();
    stack.matrix.forEach((row) => {
      row.forEach((cell) => {
        expect(cell).toBe(0);
      });
    });
  });

  test('test removeLines', () => {
    stack.matrix = [
      [0, 0, 0],
      [0, 1, 2],
      [4, 5, 6],
    ];
    const removedCount = stack.removeLines();
    expect(stack.matrix).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 1, 2],
    ]);
    expect(removedCount).toBe(1);
  });

  test('stack merge should ', () => {
    const piece = new Piece();
    piece.matrix = tetrisPiece[PIECE_TYPE.O];
    stack.matrix[stack.matrix.length-1].fill(1);
    
  });
  
});
