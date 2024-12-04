'use strict';
const fs = require('fs');

let smallText = fs.readFileSync('./small22.txt', {encoding:'utf8', flag:'r'});
let testText = fs.readFileSync('./test22.txt', {encoding:'utf8', flag:'r'});
let bigText = fs.readFileSync('./big22.txt', {encoding:'utf8', flag:'r'});
let inputText = fs.readFileSync('./input22.txt', {encoding:'utf8', flag:'r'});

let small = process(smallText)
let test = process(testText)
let big = process(bigText)
let input = process(inputText)

// A line looks like on x=-20..26,y=-36..17,z=-47..7
// output: {action: 'on', x: {lo: 20, hi: 26}, y: ...}
function process(text) {
	let lines = text.split('\n').map(x => x.split(' '))
	let result = []
	for (let l of lines) {
		let a = l[0]
		let [xx, yy, zz] = l[1].split(',').map(x => x.substring(2).split('..').map(Number))
		result.push({action: l[0], x: { lo: xx[0], hi: xx[1] }, y: {lo: yy[0], hi: yy[1]}, z: { lo: zz[0], hi: zz[1]}})
	}

	return result
}

function getCoords(lines, axis) {
	let result = []

	for (let l of lines) {
		result.push(l[axis].lo)
		result.push(l[axis].hi+1)
	}

	result = result.sort((a,b) => a-b)

	let uniq = []

	for (let r of result) {
		if (uniq.length == 0 || r != uniq[uniq.length-1]) {
			uniq.push(r)
		}
	}

	return uniq
}

function count(lines) {
	// First, collect all unique coordinates
	let xx = getCoords(lines, 'x')
	let yy = getCoords(lines, 'y')
	let zz = getCoords(lines, 'z')

	console.log('got coords')

	// console.log(xx)

	console.log('size', xx.length, yy.length, zz.length, xx.length * yy.length * zz.length)

	// Next, make a big empty matrix.
	let status = []
	for (let i=0; i < xx.length-1; i++) {
		status.push([])
		for (let j=0; j < yy.length-1; j++) {
			status[i].push([])
			for (let k=0; k < zz.length-1; k++) {
				status[i][j].push(".")
			}
		}
	}

	console.log('made a big empty matrix')

	// Then, go through all lines and turn stuff on and off.
	for (let l of lines) {
		for (let i=0; i < xx.length-1; i++) {
			for (let j=0; j < yy.length-1; j++) {
				for (let k=0; k < zz.length-1; k++) {
					// console.log('trying', l, 'with', xx[i], yy[j], zz[k], 'to', xx[i+1], yy[j+1], zz[k+1])
					if (xx[i] >= l.x.lo && xx[i+1]-1 <= l.x.hi &&
						yy[j] >= l.y.lo && yy[j+1]-1 <= l.y.hi &&
						zz[k] >= l.z.lo && zz[k+1]-1 <= l.z.hi) 	
					{
						// console.log('found one for', l)
						status[i][j][k] = l.action == "on" ? 'X' : '.'
					}
				}
			}
		}
	}

	// console.log(status)

	// Count all the pixels
	let result = 0
	for (let i=0; i < xx.length-1; i++) {
		for (let j=0; j < yy.length-1; j++) {
			for (let k=0; k < zz.length-1; k++) {
				if (status[i][j][k] == 'X') {
					result += (xx[i+1]-xx[i]) * (yy[j+1]-yy[j]) * (zz[k+1]-zz[k])
				}
			}
		}
	}

	return result
}

function partA(lines) {
	lines = lines.filter(item => item.x.lo >= -50 && item.x.hi <= 50 && item.y.lo >= -50 && item.y.hi <= 50 && item.z.lo >= -50 && item.z.hi <= 50)
	return count(lines)
}

function partB(lines) {
	return count(lines)
}


console.log(partA(small))
console.log(partA(test))
console.log(partA(input))
console.log('--')
console.log(partB(small))
console.log(partB(big))
console.log(partB(test))
console.log(partB(input))
