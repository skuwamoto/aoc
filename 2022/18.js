const fs = require('fs');

let test = fs.readFileSync('./test18.txt', 'utf8');
let input = fs.readFileSync('./input18.txt', 'utf8');

function parse(lines) {
	lines = lines.split('\n')
	let occupied = {}
	for (let l of lines) {
		occupied[l] = true
	}
	return occupied
}

function getTouches(occupied) {
	let nTouches = 0
	for (let l of Object.keys(occupied)) {
		for (let n of neighbors(l)) {
			if (occupied[n]) nTouches++
		}
	}
	return nTouches
}

function getBubbles(occupied) {
	let keys = Object.keys(occupied)
	let [maxX, maxY, maxZ] = keys[0].split(',').map(Number)

	for (let k of keys) {
		let [x,y,z] = k.split(',').map(Number)
		maxX = Math.max(x, maxX)
		maxY = Math.max(y, maxY)
		maxZ = Math.max(z, maxZ)
	}

	let painted = {}
	paint(occupied, painted, -1, -1, -1, maxX, maxY, maxZ)

	let bubbles = {}
	for (let xx=0; xx < maxX; xx++) {
		for (let yy=0; yy < maxY; yy++) {
			for (let zz=0; zz < maxZ; zz++) {
				let key = [xx,yy,zz].join(',')
				if (!occupied[key] && !painted[key]) {
					bubbles[key] = true
				}
			}
		}
	}

	return bubbles
}

function paint(occupied, painted, x, y, z, maxX, maxY, maxZ) {
	let queue = [[x,y,z].join(',')]

	while (queue.length > 0) {
		key = queue.pop()
		painted[key] = true

		for (let n of neighbors(key)) {
			let [xx, yy, zz] = n.split(',').map(Number)
			if (xx < -1 || xx > maxX+1 || yy < -1 || yy > maxY+1 || zz < -1 || zz > maxZ+1) continue
			if (!occupied[n] && !painted[n]) {
				queue.push(n)
			}
		}
	}
}

function neighbors(l) {
	let result = []
	let [x,y,z] = l.split(',').map(Number)
	for (pos of [[x-1,y,z],[x+1,y,z],[x,y-1,z],[x,y+1,z],[x,y,z-1],[x,y,z+1]]) {
		result.push(pos.join(','))
	}
	return result
}

function partA(occupied) {
	let nOccupied = Object.keys(occupied).length
	let nTouches = getTouches(occupied)
	return nOccupied*6-nTouches
}

function partB(occupied) {
	let nOccupied = Object.keys(occupied).length
	let nTouches = getTouches(occupied)
	let bubbles = getBubbles(occupied)
	let nBubbles = Object.keys(bubbles).length
	let nBubbleTouches = getTouches(bubbles)
	return nOccupied*6-nTouches-(nBubbles*6-nBubbleTouches)
}

console.log(partA(parse(test)))
console.log(partA(parse(input)))
console.log('--')
console.log(partB(parse(test)))
console.log(partB(parse(input)))

