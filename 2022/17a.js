const fs = require('fs');

let test = fs.readFileSync('./test17.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input17.txt', {encoding:'utf8', flag:'r'});

let shapes = [
	['####'],

	['.#.',
	 '###',
	 '.#.'],

	['..#',
	 '..#',
	 '###'],

	['#',
	 '#',
	 '#',
	 '#'],

	['##',
	 '##']
]

function print(chamber, count) {
	let i = 0
	for (line of chamber) {
		console.log('|' + line + '|')
		i++
		if (count && i == count) break
	}
	console.log('+' + Array(chamber[0].length).fill('-').join('') + '+')
	console.log()
}

function replaceCharAt(str, i, c) {
	return str.substr(0, i) + c + str.substr(i+1)
}

function overlap(chamber, shape, x, y) {
	for (let i=0; i < shape.length; i++) {
		for (let j=0; j < shape[i].length; j++) {
			if (shape[i][j] == '#' && chamber[y+i][x+j] == '#')
				return true
		}
	}
	return false
}

function place(chamber, shape, x, y, c) {
	let result = []
	chamber.forEach(l => result.push(l))

	for (let i=0; i < shape.length; i++) {
		for (let j=0; j < shape[i].length; j++) {
			if (shape[i][j] == '#') {
				result[y+i] = replaceCharAt(result[y+i], x+j, c)
			}
		}
	}
	return result
}

function getSignature(chamber, height, length) {
	let start = chamber.length - height
	let sig = ''
	for (let i=0; i < length; i++) {
		sig += chamber[start+i] + '\n'
	}
	return sig
}


function solve(jets, count) {
	let found = {}
	let width = 7
	let blank = Array(width).fill('.').join('')
	let chamber = []
	let height = 0
	let newHeight = 0
	let add = 0
	let j=0

	let stableCount = 2000


	// Wait for all the patterns to settle.
	let i=0
	for (i=0; ; i++) {
		// Get next shape and make space
		let shape = shapes[i%shapes.length]
		while (chamber.length < height + shape.length + 3) {
			chamber.unshift(blank)
		}

		while (chamber.length - height - 3 - shape.length > 0) {
			chamber.shift()
		}

		let x = 2
		let y = 0

		// console.log('falling')
		// print(place(chamber, shape, x, y, '@'))

		placed = false
		do {
			// Move left/right
			let dir = jets[(j++)%jets.length]
			if (dir == '<') {
				if (x > 0 && !overlap(chamber, shape, x-1, y)) {
					x--
				}
			} else {
				if (x < width-shape[0].length && !overlap(chamber, shape, x+1, y)) {
					x++
				}
			}

			// console.log('wind:', dir)
			// print(place(chamber, shape, x, y, '@'))

			// try to move down
			if (y+shape.length < chamber.length && !overlap(chamber, shape, x, y+1)) {
				y++
				// console.log('down')
				// print(place(chamber, shape, x, y, '@'))
			} else {
				placed = true
			}


		} while (!placed)

		// console.log('placed')
		chamber = place(chamber, shape, x, y, '#')
		newHeight = Math.max(height, chamber.length - y)

		if (newHeight > 1000) {
			let sig = getSignature(chamber, newHeight, 200)
			let fullSig = sig + ':' + i%shapes.length + ':' + j%jets.length

			found[fullSig] = newHeight-height
		}

		height = newHeight

		if (i > stableCount) {
			if ((count - (i+1))%Object.keys(found).length == 0) break
		}
	}

	// Add the full delta for all the patterns.
	let nCycles = Math.floor((count - (i+1)) / Object.keys(found).length)
	let totalDelta = 0
	for (let delta of Object.values(found)) {
		totalDelta += delta
	}
	height += nCycles * totalDelta

	// print(chamber)
	return height
}

console.log(solve(test, 2022))
console.log(solve(input, 2022))
console.log('--')
console.log(solve(test, 1000000000000))
console.log(solve(input, 1000000000000))

