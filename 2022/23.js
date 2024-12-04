const fs = require('fs');

let test = fs.readFileSync('./test23.txt', 'utf8');
let input = fs.readFileSync('./input23.txt', 'utf8');

function key(i, j, adj) {
	if (adj) { i += adj[0]; j += adj[1]}
	return [i,j].join(',')
}

function parse(lines) {
	let elves = new Set()
	lines = lines.split('\n')
	for (let i=0; i < lines.length; i++) {
		let l=lines[i]
		for (let j=0; j < l.length; j++) {
			if (l.charAt(j) == '#') {
				elves.add(key(i,j))
			}
		}
	}
	return elves
}

function proposedPos(elves, pos, initialDir) {
	let [i, j] = pos.split(',').map(Number)

	let hasNeighbor = false
	for (let n of allNeighbors) {
		if (elves.has(key(i, j, n))) hasNeighbor = true
	}

	if (hasNeighbor) {
		for (let d=0; d < 4; d++) {
			let dir = dirs[(initialDir+d)%4]
			let found = false
			for (let adj of dir.look) {
				if (elves.has(key(i, j, adj))) {
					found = true
				}
			}
			if (!found) return key(i, j, dir.go)
		}
	}
	return null
}

function stepIfAble(elves, initialDir) {
	let proposed = {}
	for (let pos of elves) {
		let newPos = proposedPos(elves, pos, initialDir)
		if (newPos) {
			proposed[newPos] = proposed[newPos] ? proposed[newPos]+1 : 1
		}
	}

	let newElves = new Set()

	let moved = false
	for (let pos of elves) {
		let newPos = proposedPos(elves, pos, initialDir)
		if (!newPos || proposed[newPos] > 1) {
			newElves.add(pos)
		} else {
			newElves.add(newPos)
			moved = true
		}
	}
	return moved ? newElves : null
}

function step(elves, initialDir) {
	let newElves = stepIfAble(elves, initialDir)
	return newElves ? newElves : elves
}

function countSpaces(elves) {
	let [minI, minJ] = [1000000, 1000000]
	let [maxI, maxJ] = [-1000000, -1000000]

	let count = 0
	for (let pos of elves) {
		let [i, j] = pos.split(',').map(Number)
		minI = Math.min(minI, i)
		maxI = Math.max(maxI, i)
		minJ = Math.min(minJ, j)
		maxJ = Math.max(maxJ, j)
		count++
	}
	return (maxI-minI+1) * (maxJ-minJ+1) - count
}

let dirs = [
	{go: [-1,  0], look:[[-1, -1], [-1,  0], [-1,  1]]},
	{go: [ 1,  0], look:[[ 1, -1], [ 1,  0], [ 1,  1]]},
	{go: [ 0, -1], look:[[-1, -1], [ 0, -1], [ 1, -1]]},
	{go: [ 0,  1], look:[[-1,  1], [ 0,  1], [ 1,  1]]},
]

let allNeighbors = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]

function partA(elves) {
	let dir = 0

	for (let i=0; i<10; i++) {
		elves = step(elves, dir)
		dir = (dir+1) % 4
	}
	return countSpaces(elves)
}

function partB(elves) {
	let dir = 0

	let turn = 0
	while (true) {
		turn++
		elves = stepIfAble(elves, dir)
		if (!elves) return turn
		dir = (dir+1) % 4
	}
}

console.log(partA(parse(test)))
console.log(partA(parse(input)))
console.log('--')
console.log(partB(parse(test)))
console.log(partB(parse(input)))

