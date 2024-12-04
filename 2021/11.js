'use strict';
const fs = require('fs');

let testText = fs.readFileSync('./test11.txt', {encoding:'utf8', flag:'r'});
let inputText = fs.readFileSync('./input11.txt', {encoding:'utf8', flag:'r'});

let testA = testText.split('\n').map(x => x.split('').map(Number))
let inputA = inputText.split('\n').map(x => x.split('').map(Number))

let testB = testText.split('\n').map(x => x.split('').map(Number))
let inputB = inputText.split('\n').map(x => x.split('').map(Number))

function print(lines) {
	for (let line of lines) {
		console.log(line.join(''))
	}
	console.log('\n')
}

function step(lines) {
	// Increment by one
	for (let i=0; i < lines.length; i++) {
		for (let j=0; j < lines[i].length; j++) {
			lines[i][j]++
		}
	}

	// See if any went above nine, and repeat while found
	let count = 0
	let found
	do {
		found = false
		for (let i=0; i < lines.length; i++) {
			for (let j=0; j < lines[i].length; j++) {
				// See if one has crossed the barrier
				if (lines[i][j] > 9 && lines[i][j] < 1000) {
					found = true
					count++
					lines[i][j] = 1000
					for (let ii=i-1; ii<=i+1; ii++) {
						for (let jj=j-1; jj<=j+1; jj++) {
							if (ii >= 0 && ii < lines.length && jj >= 0 && jj < lines[i].length && !(ii==i && jj==j)) {
								lines[ii][jj]++
							}
						}
					}

					// console.log("Found at", i, j)
					// print(lines)
				}
			}
		}

	} while (found)

	// Zero out 
	for (let i=0; i < lines.length; i++) {
		for (let j=0; j < lines[i].length; j++) {
			if (lines[i][j] > 9) {
				lines[i][j] = 0
			}
		}
	}

	return count
}

function partA(lines) {
	let count = 0
	for (let i=0; i < 100; i++) {
		count += step(lines)
	}
	return count
}

function partB(lines) {
	let steps = 0
	let count = 0

	do {
		count = step(lines)
		steps++
	} while (count < 100)

	return steps
}

console.log(partA(testA))
console.log(partA(inputA))
console.log('--')
console.log(partB(testB))
console.log(partB(inputB))
