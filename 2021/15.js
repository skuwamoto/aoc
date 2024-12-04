'use strict';
const fs = require('fs');

let testText = fs.readFileSync('./test15.txt', {encoding:'utf8', flag:'r'});
let inputText = fs.readFileSync('./input15.txt', {encoding:'utf8', flag:'r'});

let test = testText.split('\n').map(x => x.split('').map(Number))
let input = inputText.split('\n').map(x => x.split('').map(Number))

let best = 

function print(lines) {
    console.log(lines.map(x => x.join('')).join('\n') + '\n')
}

function partA(lines) {
	let cost = []
	let n = lines.length

	for (let i=0; i<n; i++) {
		cost.push([])
		for (let j=0; j<n; j++) {
			cost[i].push(-1)
		}
	}

	cost[0][0] = 0

	let queue = [{score: lines[0][1], i: 0, j: 1}, {score: lines[1][0], i: 1, j: 0}]

	// console.log(queue)
	while (queue.length > 0) {
		queue.sort((a,b) => a.score-b.score)
		let best = queue.shift()
		// console.log('best is', best)
		if (cost[best.i][best.j] == -1) {
			cost[best.i][best.j] = best.score
			if (best.i == n-1 && best.j == n-1) break
			if (best.i > 0   && cost[best.i-1][best.j] == -1) queue.push({score: best.score + lines[best.i-1][best.j], i: best.i-1, j: best.j})
			if (best.i < n-1 && cost[best.i+1][best.j] == -1) queue.push({score: best.score + lines[best.i+1][best.j], i: best.i+1, j: best.j})
			if (best.j > 0   && cost[best.i][best.j-1] == -1) queue.push({score: best.score + lines[best.i][best.j-1], i: best.i, j: best.j-1})
			if (best.j < n-1 && cost[best.i][best.j+1] == -1) queue.push({score: best.score + lines[best.i][best.j+1], i: best.i, j: best.j+1})
			// console.log('queue is now', queue)
		}
	}

	return cost[n-1][n-1]
}

function partB(lines) {
	let n = lines.length
	let bigLines = []

	for (let i=0; i < 5*n; i++) {
		bigLines.push([])
		for (let j=0; j < 5*n; j++) {
			let add = Math.floor(i/n) + Math.floor(j/n)
			bigLines[i][j] = ((lines[i%n][j%n] + add - 1) % 9) + 1
		}
	}

	return partA(bigLines)
}

console.log(partA(test))
console.log(partA(input))
console.log('--')
console.log(partB(test))
console.log(partB(input))
