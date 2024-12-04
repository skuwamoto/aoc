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

function print(chamber) {
	for (line of chamber) {
		console.log('|' + line + '|')
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
		let line = chamber[start + i]
		let code = 0
		for (let j = 0; j < line.length; j++) {
			code *= 2
			if (line[j] == '#') {
				code += 1
			}
		}
		sig += String.fromCharCode(code)
	}
	return sig
}


function partA(jets) {
	let found = {}
	let width = 7
	let blank = Array(width).fill('.').join('')
	let chamber = []
	let height = 0
	let j=0

	for (let i=0; i < 100000000; i++) {
		// Get next shape and make space
		let shape = shapes[i%shapes.length]
		while (chamber.length < height + shape.length + 3) {
			chamber.unshift(blank)
		}

		let x = 2
		let y = chamber.length - height - 3 - shape.length

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
		height = Math.max(height, chamber.length - y)

		// if (height > 1000) {
		// 	signature = getSignature(chamber, height, 1000)
		// 	if (found[signature]) {
		// 		console.log('aha!') 
		// 		found[signature] = true
		// 	}
		// }

		// console.log('height now', height)
		// print(chamber)
	}

	print(chamber)
	return height
}

function partB(jets) {
	let found = {}
	let width = 7
	let blank = Array(width).fill('.').join('')
	let chamber = []
	let height = 0
	let j=0

	for (let i=0; i < 100000000; i++) {
		// Get next shape and make space
		let shape = shapes[i%shapes.length]
		while (chamber.length < height + shape.length + 3) {
			chamber.unshift(blank)
		}

		let x = 2
		let y = chamber.length - height - 3 - shape.length

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
		height = Math.max(height, chamber.length - y)

		// if (height > 1000) {
		// 	signature = getSignature(chamber, height, 1000)
		// 	if (found[signature]) {
		// 		console.log('aha!') 
		// 		found[signature] = true
		// 	}
		// }

		// console.log('height now', height)
		// print(chamber)
	}

	print(chamber)
	return height
}

console.log(partA(test))
// console.log(partA(input))
console.log('--')
console.log(partB(test))
console.log(partB(input))

