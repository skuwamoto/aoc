const fs = require('fs');

var fullText = fs.readFileSync('./12.txt', 'utf8')
var fullLines = fullText.trim().split('\n').map(x => x.trim())
var fullNums = fullLines.map(x => parseInt(x, 10))

var shortText = fs.readFileSync('./12short.txt', 'utf8')
var shortLines = shortText.trim().split('\n').map(x => x.trim())
var shortNums = shortLines.map(x => parseInt(x, 10))

function part1(lines) {
	let dirs = 'ESWN'
	let dir = 'E'
	let i = 0

	let x = 0
	let y = 0

	for (let line of lines) {
		if (line == 'R90' || line =='L270') {
			i = (i+1) % 4
			dir = dirs[i]
		} else if (line == 'R180' || line == 'L180') {
			i = (i+2) % 4
			dir = dirs[i]
		} else if (line == 'R270' || line == 'L90') {
			i = (i+3) % 4
			dir = dirs[i]
		} else {
			let thisDir = line[0]
			if (thisDir == 'F') {
				thisDir = dir
			}
			let dist = parseInt(line.substr(1), 10)

			switch(thisDir) {
				case 'N':
					y += dist
					break
				case 'E':
					x += dist
					break
				case 'S':
					y -= dist
					break
				case 'W':
					x -= dist
					break
			}
		}
	}

	return Math.abs(x) + Math.abs(y)
}

function part2(lines) {
	let wayX = 10
	let wayY = 1

	let x = 0
	let y = 0

	for (let line of lines) {
		if (line == 'R90' || line =='L270') {
			let temp = wayX
			wayX = wayY
			wayY = -temp
		} else if (line == 'R180' || line == 'L180') {
			wayX = -wayX
			wayY = -wayY
		} else if (line == 'R270' || line == 'L90') {
			let temp = wayX
			wayX = -wayY
			wayY = temp
		} else {
			let dist = parseInt(line.substr(1), 10)

			switch(line[0]) {
				case 'F':
					x += dist * wayX
					y += dist * wayY
					break
				case 'N':
					wayY += dist
					break
				case 'E':
					wayX += dist
					break
				case 'S':
					wayY -= dist
					break
				case 'W':
					wayX -= dist
					break
			}
		}
	}

	return Math.abs(x) + Math.abs(y)
}



console.log(part1(shortLines))
console.log(part1(fullLines))
console.log('--')
console.log(part2(shortLines))
console.log(part2(fullLines))
console.log('-----------------------------------------------------------------')
