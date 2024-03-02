class Stack {
	stackMatrix: number[][];
	constructor() {
		this.stackMatrix = this.createMatrix(10, 20);
	}
	emptyStack() {
		this.stackMatrix.forEach((row) => row.fill(0));
	}
	removeLines() {
		let removedCount = 0;
		let lineComplete = true;
		let y = this.stackMatrix.length - 1;
		while (y >= 0) {
			for (let x = 0; x < this.stackMatrix[y].length; x++) {
				// find a completed line
				if (this.stackMatrix[y][x] === 0) {
					lineComplete = false;
				}
			}
			if (lineComplete === true) {
				// shift everything down starting from index y to cover a single completed line
				removedCount++;
				for (let i = y; i > 0; i--) {
					this.stackMatrix[i] = [...this.stackMatrix[i - 1]];
				}
			} else {
				y--;
				lineComplete = true;
			}
		}
		return removedCount;
	}

	createMatrix(sizeX: number, sizeY: number): number[][] {
		const matrix: number[][] = [];
		for (let i = 0; i < sizeY; i++) {
			matrix.push(new Array(sizeX).fill(0));
		}
		return matrix;
	}
}

export default Stack;
