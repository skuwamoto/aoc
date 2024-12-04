const fs = require('fs');

let test = fs.readFileSync('./test2.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input2.txt', {encoding:'utf8', flag:'r'});

function parseInput(lines) {
	return lines.split('\n').map(x => x.split(' '))
}

test = parseInput(test)
input = parseInput(input)

let outcome = {
	A: { X: 3, Y: 6, Z: 0 },
	B: { X: 0, Y: 3, Z: 6 },
	C: { X: 6, Y: 0, Z: 3 }
}

let scores = { X: 1, Y: 2, Z: 3 }

let want = { X: 0, Y: 3, Z: 6 }

let choose = {
	A: { X: 3, Y: 1, Z: 2 },
	B: { X: 1, Y: 2, Z: 3 },
	C: { X: 2, Y: 3, Z: 1 }
}

function partA(lines) {
	let score = 0
	for (let [a, b] of lines) {
		score += outcome[a][b] + scores[b]
	}
	return score
}

function partB(lines) {
	let score = 0
	for (let [a, b] of lines) {
		score += choose[a][b] + want[b]
	}
	return score
}

console.log(partA(test))
console.log(partA(input))
console.log('--')
console.log(partB(test))
console.log(partB(input))

