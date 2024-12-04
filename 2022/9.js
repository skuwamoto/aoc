const fs = require('fs');

let test = fs.readFileSync('./test9.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input9.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
	return lines.split('\n').map(x => x.split(' '))
}

let dirs = {
	R: [0, 1],
	L: [0, -1],
	U: [-1, 0],
	D: [1, 0]
}

function toString(pos) {
	return "" + pos[0] + ',' + pos[1]
}

function adjust(tPos, hPos) {
	if (tPos[0] == hPos[0] - 2) {
		tPos[0] = hPos[0] - 1
		if (tPos[1] > hPos[1]) tPos[1] = tPos[1]-1
		else if (tPos[1] < hPos[1]) tPos[1] = tPos[1]+1
	} else if (tPos[0] == hPos[0] + 2) {
		tPos[0] = hPos[0] + 1
		if (tPos[1] > hPos[1]) tPos[1] = tPos[1]-1
		else if (tPos[1] < hPos[1]) tPos[1] = tPos[1]+1
	} else if (tPos[1] == hPos[1] - 2) {
		tPos[1] = hPos[1] - 1
		if (tPos[0] > hPos[0]) tPos[0] = tPos[0]-1
		else if (tPos[0] < hPos[0]) tPos[0] = tPos[0]+1
	} else if (tPos[1] == hPos[1] + 2) {
		tPos[1] = hPos[1] + 1
		if (tPos[0] > hPos[0]) tPos[0] = tPos[0]-1
		else if (tPos[0] < hPos[0]) tPos[0] = tPos[0]+1
	}
}

function count(lines, num) {
	let knots = []
	for (let k=0; k < num; k++) {
		knots.push([0, 0])
	}

	let visited = {}
	visited[toString(knots[num-1])] = true

	for (let [dir, n] of lines) {
		n = Number(n)
		for (let i=0; i < n; i++) {
			knots[0][0] += dirs[dir][0]
			knots[0][1] += dirs[dir][1]

			for (let j=0; j < num-1; j++) {
				adjust(knots[j+1], knots[j])
			}

			visited[toString(knots[num-1])] = true
		}
	}

	return Object.keys(visited).length
}

function partA(lines) {
	return count(lines, 2)
}

function partB(lines) {
	return count(lines, 10)
}

console.log(partA(parse(test)))
console.log(partA(parse(input)))
console.log('--')
console.log(partB(parse(test)))
console.log(partB(parse(input)))
