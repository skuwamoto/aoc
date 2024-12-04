'use strict';
const fs = require('fs');

let testText = fs.readFileSync('./test18.txt', {encoding:'utf8', flag:'r'});
let inputText = fs.readFileSync('./input18.txt', {encoding:'utf8', flag:'r'});

let test = testText.split('\n').map(x => tokenize(x))
let input = inputText.split('\n').map(x => tokenize(x))

function split(number) {
	let result = []

	let didSplit = false
	for (let i=0; i < number.length; i++) {
		let part = number[i]

		if (part == '[' || part == ']' || part == ',') {
			result.push(part)
		} else {
			if (!didSplit && part >= 10) {
				result.push('[')
				result.push(Math.floor(part/2))
				result.push(',')
				result.push(Math.ceil(part/2))
				result.push(']')
				didSplit = true
			} else {
				result.push(part)
			}
		}
	}

	if (didSplit) {
		// console.log('splitting', result.join(''))
		return result
	} 

	return null
}

function explodeAt(number, info) {
	let result = []

	let numCount = 0
	for (let i=0; i < number.length; i++) {
		let part = number[i]

		if (i == info.bracketPos) {
			result.push(0)
			i += 4
			numCount++
		} else if (part == '[' || part == ']' || part == ',') {
			result.push(part)
		} else {
			if (numCount == info.numCount-1) {
				result.push(part + info.left)
			} else if (numCount == info.numCount+1) {
				result.push(part + info.right)
			} else {
				result.push(part)
			}
			numCount++
		}
	}
	// console.log('exploding', result.join(''))
	return result
}

function explodeInfo(number) {
	let numCount = 0

	let nest = 0
	for (let i=0; i < number.length; i++) {
		let part = number[i]

		if (part == '[') {
			nest++
			if (nest == 5) {
				return { numCount: numCount, bracketPos: i, left: number[i+1], right: number[i+3]}
			}
		}
		else if (part == ']') {
			nest--
		}
		else if (part == ',') {
			// do nothing
		}
		else {
			numCount++
		}
	}

	return null
}

function explode(number) {
	let info = explodeInfo(number)
	if (info) {
		return explodeAt(number, info)
	}
	return null
}

function reduce(number) {
	let didSomething

	do {
		didSomething = false
		if (explode(number)) {
			number = explode(number)
			didSomething = true
		} else if (split(number)) {
			number = split(number)
			didSomething = true
		}
	} while (didSomething)

	return number
}

function add(left, right) {
	let result = []
	result.push('[')
	result = result.concat(left)
	result.push(',')
	result = result.concat(right)
	result.push(']')

	result = reduce(result)

	// console.log(left.join(''), '+')
	// console.log(right.join(''), '=')
	// console.log(result.join(''), '=')
	// console.log('--')

	return result
}

function magnitude(number) {
	let stack = []

	for (let i=0; i < number.length; i++) {
		let part = number[i]
		if (part == '[') {
			// no-op
		} else if (part == ',') {
			// no-op
		} else if (part == ']') {
			let right = stack.pop()
			let left = stack.pop()
			stack.push(3 * left + 2 * right)
		} else {
			stack.push(part)
		}
	}
	return stack[0]
}

function tokenize(str) {
	let result = []
	while (str.length > 0) {
		if (str[0] == '[' || str[0] == ']' || str[0] == ',') {
			result.push(str[0])
			str = str.substring(1)
		} else {
			let num = 0
			while (str[0].match(/[0-9]/)) {
				num *= 10
				num += str.charCodeAt(0) - '0'.charCodeAt(0)
				str = str.substring(1)
			}
			result.push(num)
		}
	}
	return result
}

function partA(lines) {
	let number = lines[0]

	for (let i=1; i<lines.length; i++) {
		number = add(number, lines[i])
	}

	return magnitude(number)
}

function partB(lines) {
	let max = 0
	for (let i=0; i<lines.length; i++) {
		for (let j=0; j<lines.length; j++) {
			max = Math.max(max, magnitude(add(lines[i], lines[j])))
		}
	}
	return max
}

// let example = tokenize('[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]')
// console.log('input    ', example)
// console.log('input    ', example.join(''))
// console.log('answer   ', reduce(example).join(''))

console.log(partA(test))
console.log(partA(input))
console.log('--')
console.log(partB(test))
console.log(partB(input))
