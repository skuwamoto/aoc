'use strict';
const fs = require('fs');

let testText = fs.readFileSync('./test20.txt', {encoding:'utf8', flag:'r'});
let inputText = fs.readFileSync('./input20.txt', {encoding:'utf8', flag:'r'});

let [testRules, test] = process(testText)
let [inputRules, input] = process(inputText)

function print(lines) {
    console.log(lines.map(x => x.join('')).join('\n') + '\n')
}

function process(text) {
	let lines = text.split('\n')
	let rules = lines.shift().split('')
	lines.shift()
	lines = lines.map(x => x.split(''))
	return [rules, lines]
}

function expandN(lines, n, emptyChar) {
	let result = []
	for (let i=0; i < lines.length + 2 * n; i++) {
		let row = []
		for (let j=0; j < lines[0].length + 2 * n; j++) {
			if (i >= n && j >= n && i < lines.length+n && j < lines[0].length + n) {
				row.push(lines[i-n][j-n])
			} else {
				row.push(emptyChar) 
			}
		}
		result.push(row)
	}
	return result
}

function contractN(lines, n) {
	let result = []
	for (let i=0; i < lines.length - 2 * n; i++) {
		let row = []
		for (let j=0; j < lines[0].length - 2 * n; j++) {
			row.push(lines[i+n][j+n])
		} 
		result.push(row)
	}
	return result
}

function numAtPos(lines, i, j, emptyChar) {
	let result = ''
	for (let ii = i-1; ii <= i+1; ii++) {
		for (let jj = j-1; jj <= j+1; jj++) {
			let val = emptyChar
			if (ii >= 0 && ii < lines.length && jj >= 0 && jj < lines[0].length) {
				val = lines[ii][jj]
			} 
			result += val == '#' ? '1' : '0'
		}
	}

	return parseInt(result, 2)
}

function doRules(rules, lines, emptyChar) {
	let copy = []
	for (let i=0; i < lines.length; i++) {
		let row = []
		for (let j=0; j < lines[0].length; j++) {
			let n = numAtPos(lines, i, j, emptyChar) 
			row.push(rules[n])
		}
		copy.push(row)
	}
	return copy
}

function count(lines) {
	let count = 0
	for (let row of lines) {
		for (let item of row) {
			if (item == '#') count++
		}
	}
	return count
}

function partA(rules, lines) {
	let emptyChar = '.'

	print(lines)

	lines = expandN(lines, 4, emptyChar)

	print(lines)

	lines = doRules(rules, lines, emptyChar) 

	print(lines)

	if (rules[0] == '#') {
		emptyChar = (emptyChar == '.') ? '#' : '.'
	}

	lines = doRules(rules, lines, emptyChar) 

	print(lines)

	return(count(lines))
}

function partB(rules, lines) {
	let emptyChar = '.'

	lines = expandN(lines, 100, emptyChar)

	for (let i=0; i < 50; i++) {
		lines = doRules(rules, lines, emptyChar) 

		if (rules[0] == '#') {
			emptyChar = (emptyChar == '.') ? '#' : '.'
		}
	}

	return(count(lines))
}

console.log(partA(testRules, test))
console.log(partA(inputRules, input))
console.log('--')
console.log(partB(testRules, test))
console.log(partB(inputRules, input))
