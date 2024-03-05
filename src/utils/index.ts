export const get = <T extends HTMLElement>(
  query: string,
  parent?: HTMLElement,
) => (parent || document).querySelector<T>(query)!;

export const create = <K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options: Partial<HTMLElementTagNameMap[K]> = {},
): HTMLElementTagNameMap[K] => Object.assign(document.createElement(tagName), options);

export enum PIECE_TYPE {
  O = 'O',
  I = 'I',
  S = 'S',
  Z = 'Z',
  L = 'L',
  J = 'J',
  T = 'T',
}

export const tetrisPiece: {
  [Key in PIECE_TYPE]: number[][]
} = {
  'T': [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  'O': [
    [2, 2],
    [2, 2],
  ],
  'L': [
    [0, 3, 0],
    [0, 3, 0],
    [0, 3, 3],
  ],
  'J': [
    [0, 4, 0],
    [0, 4, 0],
    [4, 4, 0],
  ],
  'I': [
    [0, 5, 0, 0],
    [0, 5, 0, 0],
    [0, 5, 0, 0],
    [0, 5, 0, 0],
  ],
  'S': [
    [0, 6, 6],
    [6, 6, 0],
    [0, 0, 0],
  ],
  'Z': [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0],
  ],
}

export const COLORS = [
  'purple',
  'yellow',
  'orange',
  'blue',
  'cyan',
  'green',
  'red',
];