import { PieceType } from './constants';

export const get = <T extends HTMLElement>(
  query: string,
  parent?: HTMLElement,
) => (parent || document).querySelector<T>(query)!;

export const create = <K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options: Partial<HTMLElementTagNameMap[K]> = {},
): HTMLElementTagNameMap[K] => Object.assign(document.createElement(tagName), options);

export const createPieceMatrix = (type: PieceType): number[][] => {
  switch (type) {
    case 'T':
      return [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
      ];
    case 'O':
      return [
        [2, 2],
        [2, 2],
      ];
    case 'L':
      return [
        [0, 3, 0],
        [0, 3, 0],
        [0, 3, 3],
      ];
    case 'J':
      return [
        [0, 4, 0],
        [0, 4, 0],
        [4, 4, 0],
      ];
    case 'I':
      return [
        [0, 5, 0, 0],
        [0, 5, 0, 0],
        [0, 5, 0, 0],
        [0, 5, 0, 0],
      ];
    case 'S':
      return [
        [0, 6, 6],
        [6, 6, 0],
        [0, 0, 0],
      ];
    case 'Z':
      return [
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0],
      ];
    default:
      return [];
  }
};

export const iterMatrix = (
  matrix: number[][],
  callback: (y: number, x: number) => void,
) => {
  for (let y = 0; y < matrix.length; y += 1) {
    for (let x = 0; x < matrix[y].length; x += 1) {
      if (matrix[y][x] !== 0) {
        callback(y, x);
      }
    }
  }
};
