const fs = require('fs');

let test = fs.readFileSync('./test3.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input3.txt', {encoding:'utf8', flag:'r'});

function parseInput(lines) {
	return lines.split('\n').map(x => x.split(''))
}

test = parseInput(test)
input = parseInput(input)

function partA(lines) {
	let aCode = 'a'.charCodeAt(0)
	let ACode = 'A'.charCodeAt(0)
	let sum = 0
	for (let l of lines) {
		let left = {}
		let right = {}
		let size = l.length

		let i=0
		for (let c of l) {
			if (i < size/2) {
				left[c] = left[c] ? left[c] + 1 : 1
			} else {
				right[c] = right[c] ? right[c] + 1 : 1
			}
			i++
		}

		for (let k of Object.keys(left)) {
			if (right[k]) {
				if (k.charCodeAt(0) >= aCode) {
					sum += k.charCodeAt(0) - aCode + 1
				} else {
					sum += k.charCodeAt(0) - ACode + 27
				}
			}
		}
	}

	return sum
}

function partB(lines) {
	let aCode = 'a'.charCodeAt(0)
	let ACode = 'A'.charCodeAt(0)
	let sum = 0

	for (let i=0; i < lines.length;) {
		let keys = [{}, {}, {}]
		for (let j=0; j<3; j++) {
			for (let c of lines[i]) {
				keys[j][c] = true
			}
			i++
		}
		for (let k of Object.keys(keys[0])) {
			if (keys[1][k] && keys[2][k]) {
				if (k.charCodeAt(0) >= aCode) {
					sum += k.charCodeAt(0) - aCode + 1
				} else {
					sum += k.charCodeAt(0) - ACode + 27
				}

			}
		}
	}

	return sum
}

console.log(partA(test))
console.log(partA(input))
console.log('--')
console.log(partB(test))
console.log(partB(input))

