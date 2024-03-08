export const PieceTypeArray = ['O', 'I', 'S', 'Z', 'L', 'J', 'T'] as const;
export type PieceType = typeof PieceTypeArray[number];

export const COLORS = [
  'purple',
  'yellow',
  'orange',
  'blue',
  'cyan',
  'green',
  'red',
];
