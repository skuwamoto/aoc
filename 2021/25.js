'use strict';
const fs = require('fs');

let testText = fs.readFileSync('./input25test.txt', {encoding:'utf8', flag:'r'});
let inputText = fs.readFileSync('./input25.txt', {encoding:'utf8', flag:'r'});

let test = testText.split('\n').map(x => x.split(''))
let input = inputText.split('\n').map(x => x.split(''))

function partA(lines) {
	let n = lines.length
	let m = lines[0].length

	let didMove
	let steps = 0
	do {
		didMove = false
		// First, move east
		let moves = []
		for (let i=0; i < n; i++) {
			for (let j=0; j < m; j++) {
				if (lines[i][j] == '>' && lines[i][(j+1)%m] == '.') {
					moves.push({i, j})
					didMove = true
				}
			}
		}

		for (let {i, j} of moves) {
			lines[i][(j+1)%m] = '>'
			lines[i][j] = '.'
		}

		// next, move south
		moves = []
		for (let i=0; i < n; i++) {
			for (let j=0; j < m; j++) {
				if (lines[i][j] == 'v' && lines[(i+1)%n][j] == '.') {
					moves.push({i, j})
					didMove = true
				}
			}
		}

		for (let {i, j} of moves) {
			lines[(i+1)%n][j] = 'v'
			lines[i][j] = '.'
		}
		steps++

	} while (didMove)

	return steps
}

function partB(lines) {
}

console.log(partA(test))
console.log(partA(input))
console.log('--')
console.log(partB(test))
console.log(partB(input))
