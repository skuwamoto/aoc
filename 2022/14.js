const fs = require('fs');

let test = fs.readFileSync('./test14.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input14.txt', {encoding:'utf8', flag:'r'});

let xMin = 0
let xMax = 1000
let yMin = 0
let yMax = 300

function parse(lines) {
	let data = []
	for (let i=yMin; i <= yMax; i++) {
		data.push([])
		for (let j=xMin; j <= xMax; j++) {
			data[i].push('.')
		}
	}

	lines = lines.split('\n').map(x => x.split(' -> ').map(x => x.split(',').map(Number)))

	for (l of lines) {
		let x=0, y=0
		let [endx, endy] = l[0]

		for (next of l) {
			x = endx
			y = endy
			endx = next[0]
			endy = next[1]

			data[y-yMin][x-xMin] = '#'
			while (x != endx || y != endy) {
				x += Math.sign(endx-x)
				y += Math.sign(endy-y)
				data[y-yMin][x-xMin] = '#'
			}
		}
	}

	return data
}

function partA(data) {
	let x = 500-xMin, y = 0
	while (true) {
		if (y+1 == data.length) {
			break
		}
		if (data[y+1][x] == '.') {
			y++
		} else if (data[y+1][x-1] == '.') {
			y++
			x--
		} else if (data[y+1][x+1] == '.') {
			y++
			x++
		} else {
			data[y][x] = 'o'
			if (y == 0) break
			x = 500-xMin, y = 0
			continue
		}
	}

	let sum = 0
	for (let row of data) {
		for (let cell of row) {
			if (cell == 'o') sum++
		}
	}

	return sum
}

function partB(data) {
	let maxI = 0
	for (let i=0; i < data.length; i++) {
		if (data[i].includes('#')) {
			maxI = i
		}
	}

	for (let j=0; j < data[maxI+2].length; j++) {
		data[maxI+2][j] = '#'
	}

	return partA(data)
}

console.log(partA(parse(test)))
console.log(partA(parse(input)))
console.log('--')
console.log(partB(parse(test)))
console.log(partB(parse(input)))

