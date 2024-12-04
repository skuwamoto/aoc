'use strict';
const fs = require('fs');

// let testText = fs.readFileSync('./test24.txt', {encoding:'utf8', flag:'r'});
// let inputText = fs.readFileSync('./input24.txt', {encoding:'utf8', flag:'r'});

// let test = testText.split('\n').map(x => x.split('').map(Number))
// let input = inputText.split('\n').map(x => x.split('').map(Number))

const data = [
	{ p1: 13, p2: 6},  // [6+d1]
	{ p1: 15, p2: 7},  // [6+d1, 7+d2]
	{ p1: 15, p2: 10}, // [6+d1, 7+d2, 10+d3]
	{ p1: 11, p2: 2},  // [6+d1, 7+d2, 10+d3, 2+d4]
	{ p1: -7, p2: 15}, // [6+d1, 7+d2, 10+d3] (if 2+d4-7 == d5)
	{ p1: 10, p2: 8},  // [6+d1, 7+d2, 10+d3, 8+d6]
	{ p1: 10, p2: 1},  // [6+d1, 7+d2, 10+d3, 8+d4, 1+d7]
	{ p1: -5, p2: 10}, // [6+d1, 7+d2, 10+d3, 8+d4] (if 1+d7-5 == d8)
	{ p1: 15, p2: 5},  // [6+d1, 7+d2, 10+d3, 8+d4, 5+d9]
	{ p1: -3, p2: 3},  // [6+d1, 7+d2, 10+d3, 8+d4] (if 5+d9-3 == d10)
	{ p1: 0,  p2: 5},  // [6+d1, 7+d2, 10+d3] (if 8+d4-0 == d11) !!!
	{ p1: -5, p2: 11}, // [6+d1, 7+d2] (if 10+d3-5 == d12)
	{ p1: -9, p2: 12}, // [6+d1] (if 7+d2-9 == d13)
	{ p1: 0,  p2: 10}, // if 6+d1-0 == d14
]

function findBiggest() {
	let stack = []
	let result = "00000000000000".split('').map(Number)

	for (let i=0; i < data.length; i++) {
		let {p1, p2} = data[i]
		if (p1 > 0) {
			stack.push({i: i, p2: p2})
		} else {
			let prev = stack.pop()
			let p = prev.p2 + p1
			if (p < 0) {
				result[prev.i] = 9
				result[i] = 9 + p
			} else {
				result[i] = 9
				result[prev.i] = 9 - p
			}
		}
	}

	return result.join('')
}

function findSmallest() {
	let stack = []
	let result = "00000000000000".split('').map(Number)

	for (let i=0; i < data.length; i++) {
		let {p1, p2} = data[i]
		if (p1 > 0) {
			stack.push({i: i, p2: p2})
		} else {
			let prev = stack.pop()
			let p = prev.p2 + p1
			if (p < 0) {
				result[prev.i] = 1 - p
				result[i] = 1
			} else {
				result[i] = 1 + p
				result[prev.i] = 1
			}
		}
	}

	return result.join('')
}

// d4-5 == d5
// d7-4 == d8
// d9+2 == d10
// d6+8 == d11
// d3-5 == d12
// d2-2 == d13
// d1+6 == d14




function monad(num) {
	let input = String(num).split('').map(Number)

	let [x, y, z, w] = [0, 0, 0, 0]

	for (let {p1, p2} of data) {
		// Get next digit
		w = input.shift()

		// Get remainder and add p1 to x
		x = (z % 26) + p1

		// For non-positive p1, shift z down
		if (p1 <= 0) {
			z = Math.trunc(z / 26)
		}

		// If z does not match the input, shift z up and add input and p2
		if (x != w) {
			z *= 26
			z += w + p2
		}
	}
}

//  1: 3
//  2: 9
//  3: 9
//  4: 9
//  5: 4
//  6: 1
//  7: 9
//  8: 5
//  9: 7
// 10: 9
// 11: 9
// 12: 4
// 13: 7
// 14: 9


console.log(findBiggest())
console.log(findSmallest())
