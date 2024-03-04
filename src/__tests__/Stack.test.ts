import Stack from '../game/Stack';

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
    stack.stackMatrix = [];
    stack.createMatrix(2, 3);
    expect(stack.stackMatrix.length).toBe(2);
    expect(stack.stackMatrix[0].length).toBe(3);
  });

  test('test emptyStack', () => {
    stack.emptyStack()
    stack.stackMatrix.forEach(row => {
      row.forEach(cell => {
        expect(cell).toBe(0);
      });
    });
  });

  test('test removeLines', () => {
    stack.stackMatrix = [
      [0,0,0],
      [0,1,2],
      [4,5,6]
    ];
    const removedCount = stack.removeLines();
    expect(stack.stackMatrix).toEqual([
      [0,0,0],
      [0,0,0],
      [0,1,2]
    ]);
    expect(removedCount).toBe(1);

  })
});
