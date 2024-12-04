const fs = require('fs');

let test = fs.readFileSync('./test8.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input8.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
	// lines
	return lines.split('\n').map(x => x.split('').map(Number))
}

function isVisible(lines, i, j) {
	let found = false
	for (let ii=i-1; ii >= 0; ii--) {
		if (lines[ii][j] >= lines[i][j]) found = true
	}
	if (!found) return true

	found = false
	for (let ii=i+1; ii < lines.length; ii++) {
		if (lines[ii][j] >= lines[i][j]) found = true
	}
	if (!found) return true

	found = false

	for (let jj=j-1; jj >= 0; jj--) {
		if (lines[i][jj] >= lines[i][j]) found = true
	}
	if (!found) return true

	found = false
	for (let jj=j+1; jj < lines[0].length; jj++) {
		if (lines[i][jj] >= lines[i][j]) found = true
	}
	if (!found) return true

	return false
}

function visScore(lines, i, j) {
	let up = 0
	for (let ii=i-1; ii >= 0; ii--) {
		up++
		if (lines[ii][j] >= lines[i][j]) break
	}

	let down = 0
	for (let ii=i+1; ii < lines.length; ii++) {
		down++
		if (lines[ii][j] >= lines[i][j]) break
	}

	let left = 0
	for (let jj=j-1; jj >= 0; jj--) {
		left++
		if (lines[i][jj] >= lines[i][j]) break
	}

	let right = 0
	for (let jj=j+1; jj < lines[0].length; jj++) {
		right++
		if (lines[i][jj] >= lines[i][j]) break
	}

	return left * right * up * down
}

function partA(lines) {
	let count = 0
	for (let i=0; i < lines.length; i++) {
		for (let j=0; j < lines[i].length; j++) {
			if (isVisible(lines, i, j)) count++
		}
	}
	return count
}

function partB(lines) {
	let best = 0
	for (let i=0; i < lines.length; i++) {
		for (let j=0; j < lines[i].length; j++) {
			best = Math.max(best, visScore(lines, i, j))
		}
	}
	return best
}

console.log(partA(parse(test)))
console.log(partA(parse(input)))
console.log('--')
console.log(partB(parse(test)))
console.log(partB(parse(input)))

