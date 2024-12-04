const fs = require('fs');

var text = fs.readFileSync('./11.txt', 'utf8')
var lines = text.trim().split('\n').map(x => x.trim())
var nums = lines.map(x => parseInt(x, 10))

var width = 0
var height = 0

function inBounds(i, j) {
	return i >= 0 && j >= 0 && i < height && j < width;
}

function countNear(lines, i, j) {
	let near = 0
	for (let k=i-1; k<=i+1; k++) {
		for (let l=j-1; l<=j+1; l++) {
			if ((k != i || l != j) && inBounds(k, l) && lines[k][l] == '#') near++
		}
	}				
	return near
}

function countNear2(lines, i, j) {
	let near = 0
	let diffs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]

	for (let d of diffs) {
		let k = i+d[0]
		let l = j+d[1]
		while (inBounds(k, l)) {
			if (lines[k][l] == '#') {
				near++
				break;
			}
			if (lines[k][l] == 'L') {
				break
			}
			k += d[0]
			l += d[1]
		}		
	}
	return near
}

function part1(lines) {
	height = lines.length
	width = lines[0].length

	let changed = false
	let n = 0
	do {
		var newLines = []
		changed = false
		for (let i=0; i<lines.length; i++) {
			newLines[i] = []
			for (let j=0; j<lines[i].length; j++) {
				let near = countNear(lines, i, j)
				newLines[i][j] = lines[i][j]
				if (lines[i][j] == 'L' && near == 0) {
					newLines[i][j] = '#' 
					changed = true
				} else if (lines[i][j] == '#' && near >= 4) {
					newLines[i][j] = 'L'
					changed = true
				}
			}
		}
		lines = newLines
	} while(changed)

	let count = 0
	for (let i=0; i<lines.length; i++) {
		let str = ''
		for (let j=0; j<lines[i].length; j++) {
			if (lines[i][j] == '#') count++
			str += lines[i][j]
		}
	}
	return count
}

function part2(lines) {
	height = lines.length
	width = lines[0].length

	let changed = false
	let n = 0
	do {
		var newLines = []
		changed = false
		for (let i=0; i<lines.length; i++) {
			newLines[i] = []
			for (let j=0; j<lines[i].length; j++) {
				let near = countNear2(lines, i, j)
				newLines[i][j] = lines[i][j]
				if (lines[i][j] == 'L' && near == 0) {
					newLines[i][j] = '#' 
					changed = true
				} else if (lines[i][j] == '#' && near >= 5) {
					newLines[i][j] = 'L'
					changed = true
				}
			}
		}
		lines = newLines
	} while(changed)

	let count = 0
	for (let i=0; i<lines.length; i++) {
		let str = ''
		for (let j=0; j<lines[i].length; j++) {
			if (lines[i][j] == '#') count++
			str += lines[i][j]
		}
		console.log(str)
	}
	return count
}

console.log(part1(lines))
console.log(part2(lines))
