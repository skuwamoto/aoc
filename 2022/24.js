const fs = require('fs');

let test = fs.readFileSync('./test24.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input24.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
	lines = lines.split('\n')

	let room = {
		left: [], right: [], up: [], down: [], height: lines.length-2, width: lines[0].length-2
	}
	for (let i=1; i < lines.length-1; i++) {
		let l = lines[i]
		for (let dir of ['left', 'right', 'up', 'down']) {
			room[dir].push([])
		}
		for (let j=1; j < l.length-1; j++) {
			let c = l[j]
			room.left.at(-1).push(c == '<')
			room.right.at(-1).push(c == '>')
			room.up.at(-1).push(c == '^')
			room.down.at(-1).push(c == 'v')
		}
	}
	return room
}

function mod(n, m) {
	while (n < 0) n += m
	return n % m
}

function nearPlayer(player, i, j) {
	let [h, w] = [player.length, player[0].length]
	return (player[i][j]) || (i > 0 && player[i-1][j]) || (j > 0 && player[i][j-1]) || (i < h-1 && player[i+1][j]) || (j < w-1 && player[i][j+1])
}

function hasBlizzardAt(room, i, j, turn) {
	let [w, h] = [room.width, room.height]
	return room.left[i][mod(j+turn, w)] || room.right[i][mod(j-turn, w)] || room.up[mod(i+turn, h)][j] || room.down[mod(i-turn, h)][j]
}

function best(room, startI, startJ, goalI, goalJ, startTurn) {
	let bestSoFar = {}
	let count = 0

	let player = []
	for (let i=0; i < room.height; i++) {
		player[i] = new Array(room.width).fill(false)
	}

	for (let turn=startTurn+1; ; turn++) {
		let newPlayer = []
		for (let i=0; i < room.height; i++) {
			newPlayer[i] = new Array(room.width).fill(false)
		}

		if (hasBlizzardAt(room, startI, startJ, turn)) {
			newPlayer[startI][startJ] = true
		}

		for (let i=0; i < room.height; i++) {
			for (let j=0; j < room.width; j++) {
				if (nearPlayer(player, i, j) && hasBlizzardAt(room, i, j, turn)) {
					newPlayer[i][j] = true
					if (i == goalI && j == goalJ) {
						return turn+1
					}
				}
			}
		}
		player = newPlayer
	}
}

function partA(room) {
	return best(room, 0, 0, room.height-1, room.width-1, 0)
}

function partB(room) {
	let one = best(room, 0, 0, room.height-1, room.width-1, 0)
	let two = best(room, room.height-1, room.width-1, 0, 0, one)
	let three = best(room, 0, 0, room.height-1, room.width-1, two)

	return three
}

console.log(partA(parse(test)))
console.log(partA(parse(input)))
console.log('--')
console.log(partB(parse(test)))
console.log(partB(parse(input)))

