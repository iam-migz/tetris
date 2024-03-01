export type HighScoresType = {
	id: string;
	name: string;
	score: number;
	createdAt: Timestamp;
};

export type PieceType = 'O' | 'I' | 'S' | 'Z' | 'L' | 'J' | 'T';