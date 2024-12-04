'use strict';
const fs = require('fs');

let testText = fs.readFileSync('./test19.txt', {encoding:'utf8', flag:'r'});
let inputText = fs.readFileSync('./input19.txt', {encoding:'utf8', flag:'r'});

let test = testText.split('\n\n').map(x => x.split('\n'))
let input = inputText.split('\n\n').map(x => x.split('\n'))

test.forEach(x => x.shift())
input.forEach(x => x.shift())

test = test.map(x => x.map(x => x.split(',').map(Number)))
input = input.map(x => x.map(x => x.split(',').map(Number)))

function rx(point) {
	let result = [0,0,0]
	result[0] = point[0]
	result[1] = point[2]
	result[2] = -point[1]

	return result
}

function ry(point) {
	let result = [0,0,0]
	result[0] = point[2]
	result[1] = point[1]
	result[2] = -point[0]

	return result
}

function rz(point) {
	let result = [0,0,0]
	result[0] = point[1]
	result[1] = -point[0]
	result[2] = point[2]

	return result
}

function getRotations(points) {
	let result = []

	// rz^n
	result.push(points.concat())
	result.push(points.map(rz))
	result.push(points.map(rz).map(rz))
	result.push(points.map(rz).map(rz).map(rz))

	// rx rz^n
	result.push(points.map(rx))
	result.push(points.map(rx).map(rz))
	result.push(points.map(rx).map(rz).map(rz))
	result.push(points.map(rx).map(rz).map(rz).map(rz))

	// rx ry rz^n
	result.push(points.map(rx).map(ry))
	result.push(points.map(rx).map(ry).map(rz))
	result.push(points.map(rx).map(ry).map(rz).map(rz))
	result.push(points.map(rx).map(ry).map(rz).map(rz).map(rz))

	// rx ry^2 rz^n
	result.push(points.map(rx).map(ry).map(ry))
	result.push(points.map(rx).map(ry).map(ry).map(rz))
	result.push(points.map(rx).map(ry).map(ry).map(rz).map(rz))
	result.push(points.map(rx).map(ry).map(ry).map(rz).map(rz).map(rz))

	// rx ry^3 rz^n
	result.push(points.map(rx).map(ry).map(ry).map(ry))
	result.push(points.map(rx).map(ry).map(ry).map(ry).map(rz))
	result.push(points.map(rx).map(ry).map(ry).map(ry).map(rz).map(rz))
	result.push(points.map(rx).map(ry).map(ry).map(ry).map(rz).map(rz).map(rz))

	// rx^2 rz^n
	result.push(points.map(rx).map(rx))
	result.push(points.map(rx).map(rx).map(rz))
	result.push(points.map(rx).map(rx).map(rz).map(rz))
	result.push(points.map(rx).map(rx).map(rz).map(rz).map(rz))

	return result
}

function countMatches(found, shiftedKeys) {
	let count = 0
	for (let k of shiftedKeys) {
		if (found[k]) {
			count++
			if (count == 12) return 12
		}
	}
	return count
}

function addMatches(found, shiftedKeys) {
	for (let k of shiftedKeys) {
		found[k] = true
	}
}

function getShiftedKeys(points, p1, p2) {
	let result = []
	for (let p of points) {
		let pp = [p[0] - p1[0] + p2[0], p[1] - p1[1] + p2[1], p[2] - p1[2] + p2[2]]
		result.push(pp.join(','))
	}
	return result
}

function partA(lines) {
	let total = 0
	let all = lines.map(getRotations)

	let found = {}
	let first = all.shift()
	addMatches(found, getShiftedKeys(first[0], [0,0,0], [0,0,0])) // Always pick the first rotation of the first one.

	let foundMatch = false
	while (all.length > 0) {
		foundMatch = false
		// Look through all remaining scanners
		let i
		for (i=0; i < all.length; i++) {
			// For each scanner, look through all rotations
			for (let r=0; r < all[i].length; r++) {
				// For each rotation, look through all pairs of points
				// console.log('trying', all[i][r])
				for (let p1 of all[i][r]) {
					for (let p2 of Object.keys(found).map(x => x.split(',').map(Number))) {
						let shiftedKeys = getShiftedKeys(all[i][r], p1, p2)
						if (countMatches(found, shiftedKeys) >= 12) {
							addMatches(found, shiftedKeys)
							total++
							console.log("Found match", total)
							foundMatch = true
						}
						if (foundMatch) break
					}
					if (foundMatch) break
				}
				if (foundMatch) break
			}
			if (foundMatch) break
		}
		if (!foundMatch) {
			throw new Error('oops!')
		}
		all.splice(i, 1)
	}
	return Object.keys(found).length
}

function maxDist(points) {
	console.log(points)
	let max = 0

	for (let p1 of points) {
		for (let p2 of points) {
			let dist = Math.abs(p2[0]-p1[0]) + Math.abs(p2[1]-p1[1]) + Math.abs(p2[2]-p1[2])
			max = Math.max(dist, max)
		}
	}
	return max
}

function partB(lines) {
	let total = 0
	let all = lines.map(getRotations)

	let found = {}
	let first = all.shift()
	let offsets = []

	addMatches(found, getShiftedKeys(first[0], [0,0,0], [0,0,0])) // Always pick the first rotation of the first one.

	offsets.push([0,0,0])

	let foundMatch = false
	while (all.length > 0) {
		foundMatch = false
		// Look through all remaining scanners
		let i
		for (i=0; i < all.length; i++) {
			// For each scanner, look through all rotations
			for (let r=0; r < all[i].length; r++) {
				// For each rotation, look through all pairs of points
				// console.log('trying', all[i][r])
				for (let p1 of all[i][r]) {
					for (let p2 of Object.keys(found).map(x => x.split(',').map(Number))) {
						let shiftedKeys = getShiftedKeys(all[i][r], p1, p2)
						if (countMatches(found, shiftedKeys) >= 12) {
							addMatches(found, shiftedKeys)
							total++
							console.log("Found match", total)
							offsets.push([p2[0]-p1[0], p2[1]-p1[1], p2[2]-p1[2]])
							foundMatch = true
						}
						if (foundMatch) break
					}
					if (foundMatch) break
				}
				if (foundMatch) break
			}
			if (foundMatch) break
		}
		if (!foundMatch) {
			throw new Error('oops!')
		}
		all.splice(i, 1)
	}

	return maxDist(offsets)
}

// console.log(partA(test))
// console.log(partA(input))
console.log('--')
console.log(partB(test))
console.log(partB(input))
