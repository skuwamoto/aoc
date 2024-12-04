'use strict';
const fs = require('fs');

let test = fs.readFileSync('./test10.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input10.txt', {encoding:'utf8', flag:'r'});

test = test.split('\n').map(x => x.split(''))
input = input.split('\n').map(x => x.split(''))

let scoreA = {
	')': 3, 
	']': 57, 
	'}': 1197, 
	'>': 25137
}

let scoreB = {
	')': 1, 
	']': 2, 
	'}': 3, 
	'>': 4
}

let expect = {
	'(': ')',
	'[': ']',
	'{': '}',
	'<': '>'
}

function partA(lines) {
	let score = 0
	for (let line of lines) {
		let stack = []
		for (let c of line) {
			if (!scoreA[c]) {
				stack.push(expect[c])
			} else {
				let expect = stack.length == 0 ? 'X' : stack.pop()
				if (expect != c) {
					score += scoreA[c]
					break
				}
			}
		}
	}
	return score
}

function partB(lines) {
	let scores = []

	for (let line of lines) {
		let stack = []
		let score = 0
		let corrupted = false
		for (let c of line) {
			if (!scoreA[c]) {
				stack.push(expect[c])
			} else {
				let expect = stack.length == 0 ? 'X' : stack.pop()
				if (expect != c) {
					console.log('corrupted')
					corrupted = true
					break
				}
			}
		}
		if (!corrupted) {
			console.log('end stack is', stack)
			while (stack.length) {
				score *= 5
				score += scoreB[stack.pop()]
			}
			scores.push(score)
		}
	}

	scores.sort((a,b) => a-b)

	return scores[Math.floor(scores.length/2)]
}

console.log(partA(test))
console.log(partA(input))
console.log('--')
console.log(partB(test))
console.log(partB(input))
