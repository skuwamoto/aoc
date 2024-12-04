'use strict';
const fs = require('fs');

let test = fs.readFileSync('./test9.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input9.txt', {encoding:'utf8', flag:'r'});

test = test.split('\n').map(x => x.split('').map(Number))
input = input.split('\n').map(x => x.split('').map(Number))

function lowPoints(lines) {
	let result = []

	for (let i=0; i < lines.length; i++) {
		let line = lines[i]

		let str = ''
		for (let j=0; j < line.length; j++) {
			let n = line[j]

			if ( (i == 0 || n < lines[i-1][j]) && 
				 (i == lines.length-1 || n < lines[i+1][j]) &&
				 (j == 0 || n < lines[i][j-1]) &&
				 (j == line.length-1 || n < lines[i][j+1]) ) {

				result.push([i, j])
			}
		}
	}
	return result
}

function partA(lines) {
	let risk = 0
	let points = lowPoints(lines)

	for (let p of points) {
		let [i, j] = p
		risk += lines[i][j] + 1
	}

	return risk
}

function basinSize(lines, i, j) {
	let size = 1
	lines[i][j] = 9
	if (i != 0 && lines[i-1][j] != 9) size += basinSize(lines, i-1, j)
	if (j != 0 && lines[i][j-1] != 9) size += basinSize(lines, i, j-1)
	if (i != lines.length-1 && lines[i+1][j] != 9) size += basinSize(lines, i+1, j)
	if (j != lines[0].length-1 && lines[i][j+1] != 9) size += basinSize(lines, i, j+1)
	return size
}

function partB(lines) {
	let points = lowPoints(lines)
	let basins = points.map(x => basinSize(lines, x[0], x[1]))

	basins.sort((a,b) => b-a)

	return basins[0] * basins[1] * basins[2]
}

console.log(partA(test))
console.log(partA(input))
console.log('--')
console.log(partB(test))
console.log(partB(input))
