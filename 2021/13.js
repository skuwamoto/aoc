'use strict';
const fs = require('fs');

let testText = fs.readFileSync('./test13.txt', {encoding:'utf8', flag:'r'});
let inputText = fs.readFileSync('./input13.txt', {encoding:'utf8', flag:'r'});

let [testDots, testFold] = testText.split('\n\n')
testDots = testDots.split('\n').map(x => x.split(',').map(Number))
testFold = testFold.split('\n').map(x => x.substring("fold along ".length).split('='))
testFold.forEach(x => x[1] = Number(x[1]))

let [inputDots, inputFold] = inputText.split('\n\n')
inputDots = inputDots.split('\n').map(x => x.split(',').map(Number))
inputFold = inputFold.split('\n').map(x => x.substring("fold along ".length).split('='))
inputFold.forEach(x => x[1] = Number(x[1]))

function makeSheet(dots) {
	let maxX = 0
	let maxY = 0
	dots.forEach(p => { maxX = Math.max(maxX, p[0]); maxY = Math.max(maxY, p[1])})

	let sheet = []
	for (let i=0; i <= maxY; i++) {
		sheet.push([])
		for (let j=0; j <= maxX; j++) {
			sheet[i].push('.')
		}
	}
	for (let p of dots) {
		sheet[p[1]][p[0]] = '#'
	}

	return sheet
}

function doFold(sheet, f) {
	let result = []
	let [dir, fold] = f

	if (dir == 'y') {
		for (let i=0; i < sheet.length; i++) {
			if (i < fold) {
				result.push(sheet[i].concat())
			} else if (i > fold) {
				for (let j=0; j < sheet[i].length; j++) {
					if (sheet[i][j] == '#') result[2*fold-i][j] = '#'
				}
			}
		}
	} else {
		for (let i=0; i < sheet.length; i++) {
			result.push([])
			for (let j=0; j < sheet[i].length; j++) {
				if (j < fold) {
					result[i].push(sheet[i][j])
				} else if (j > fold) {
					if (sheet[i][j] == '#') result[i][2*fold-j] = '#'					
				}
			} 
		}
	}
	return result
}

function countDots(sheet) {
	let count = 0
	for (let line of sheet) {
		for (let dot of line) {
			if (dot == '#') count++
		}
	}
	return count
}

function print(lines) {
    console.log(lines.map(x => x.join('')).join('\n') + '\n')
}

function partA(dots, folds) {
	let sheet = makeSheet(dots)
	sheet = doFold(sheet, folds[0])
	return countDots(sheet)
}

function partB(dots, folds) {
	let sheet = makeSheet(dots)

	for (let f of folds) {
		sheet = doFold(sheet, f)		
	}
	print(sheet)

	return countDots(sheet)
}

// console.log(partA(testDots, testFold))
// console.log(partA(inputDots, inputFold))
// console.log('--')
console.log(partB(testDots, testFold))
console.log(partB(inputDots, inputFold))
