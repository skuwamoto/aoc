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
	let lines = text.trim().split('\n').map(x => x.split(' '))
	let result = []
	let order = 1
	for (let l of lines) {
		let a = l[0]
		let [xx, yy, zz] = l[1].split(',').map(x => x.substring(2).split('..').map(Number))
		result.push({action: l[0], order: order++, x: { lo: xx[0], hi: xx[1] }, y: {lo: yy[0], hi: yy[1]}, z: { lo: zz[0], hi: zz[1]}})
	}

	return result
}

function overlap(a, b) {
	return !( (a.hi < b.lo) || (b.hi < a.lo) )
}

function splitAt(ll, axis, point) {
	let result = []
	for (let l of ll) {
		if (l[axis].lo < point && l[axis].hi >= point) {
			let left = Object.assign({}, l)
			let right = Object.assign({}, l)
			left[axis] = { lo: l[axis].lo, hi: point - 1 }		
			right[axis] = { lo: point, hi: l[axis].hi }
			result.push(left)
			result.push(right)
		} else {
			result.push(l)
		}
	}
	return result
}

function split(lines) {
	for (let i=0; i < lines.length; i++) {
		for (let j=0; j < i; j++) {
			let l = lines[i] // Have to re-get this here because it may have changed.
			let k = lines[j]
			if (i != j && overlap(l.x, k.x) && overlap(l.y, k.y) && overlap(l.z, k.z)) {
				let ll = [l]
				let kk = [k]

				for (let axis of ['x', 'y', 'z']) {
					if (l[axis].lo != k[axis].lo || l[axis].hi != k[axis].hi) {
						let left
						let right

						ll = splitAt(ll, axis, k[axis].lo)
						kk = splitAt(kk, axis, l[axis].lo)
						ll = splitAt(ll, axis, k[axis].hi+1)
						kk = splitAt(kk, axis, l[axis].hi+1)
					}
				}

				let didSplit = false

				if (ll.length > 1) {
					lines.splice(i, 1, ...ll)
					didSplit = true
				}
				if (kk.length > 1) {
					lines.splice(j, 1, ...kk)
					j += kk.length-1
					i += kk.length-1
					didSplit = true
				}
				if (didSplit) {
					// console.log('splitting on', i, j)
					// console.log(lines.map(JSON.stringify))
				}
			}
		}
	}
}

function count(lines) {
	// console.log(lines.map(JSON.stringify))
	split(lines)

	let count = 0
	let seen = {}
	for (let i=lines.length-1; i >= 0; i--) {
		let l = lines[i]
		let key = JSON.stringify([l.x, l.y, l.z])
		if (!seen[key]) {
			if (l.action == 'on') {
				count += (l.x.hi - l.x.lo + 1) * (l.y.hi - l.y.lo + 1) * (l.z.hi - l.z.lo + 1) 
			}
			seen[key] = true
		}
	}

	return count
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
