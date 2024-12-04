const fs = require('fs');

let test = fs.readFileSync('./test22.txt', 'utf8');
let input = fs.readFileSync('./input22.txt', 'utf8');

function print(lines) {
    console.log(lines.map(x => x.join('')).join('\n') + '\n')
}

function parse(lines) {
	let [map, instr] = lines.split('\n\n')

	// Split the map into a square 2d array
	map = map.split('\n').map(x => x.split(''))
	let maxLen = map.reduce((acc, x) => Math.max(acc, x.length), 0)
	for (let l of map) {
		while (l.length < maxLen) {
			l.push(' ')
		}
	}

	// Split instruction into pairs of numbers and directions.
	instr = Array.from(instr.matchAll(/(\d+)([LR]?)/g)).map(x => [Number(x[1]), x[2]])

	return [map, instr]
}

let delta = [[0, 1], [1, 0], [0, -1], [-1, 0]]
let dirs = ['>', 'v', '<', '^']

function move(map, x, y, dir) {
	let d = delta[dir]
	map[y][x] = dirs[dir]

	let [oldX, oldY] = [x, y]

	// For part 1, we just wrap around and skip spaces.
	do {
		y = (y + d[0] + map.length) % map.length
		x = (x + d[1] + map[y].length) % map[y].length
	}
	while (map[y][x] == ' ')

	if (map[y][x] == '#') {
		[x, y] = [oldX, oldY]
	}

	return [x, y]
}

function cubeMove(map, x, y, dir) {
	let d = delta[dir]
	map[y][x] = dirs[dir]

	let [oldX, oldY] = [x, y]

	let oldXFace = Math.floor(x / 50)
	let oldYFace = Math.floor(y / 50)
	let oldDir = dir

	y = (y + d[0] + map.length) % map.length
	x = (x + d[1] + map[y].length) % map[y].length

	let newXFace = Math.floor(x / 50)
	let newYFace = Math.floor(y / 50)

	// Our cube looks like this
	//
	//  0-49  | 50-99 | 100-149
	// -------------------------
	//        |       |        | 0
	//        |   A   |    B   |  
	//        |       |        | 49
	// ------------------------
	//        |       |        | 50
	//        |   C   |        |  
	//        |       |        | 99
	// ------------------------
	//        |       |        | 100
	//    D   |   E   |        | 
	//        |       |        | 149
	// ------------------------
	//        |       |        | 150
	//    F   |       |        |  
	//        |       |        | 199

	// Moved faces. Map x and y more carefully
	if (oldXFace != newXFace || oldYFace != newYFace) {
		if (oldXFace == 1 && oldYFace == 0) {
			// Face A -> up to F
			if (dir == dirs.indexOf('^')) {
				// x from 50-99 maps to y from 150-199
				// x goes to 0
				// dir is >
				//  
				[x, y] = [0, oldX + 100]
				dir = dirs.indexOf('>')
			}
			// Face A -> left to D
			else if (dir == dirs.indexOf('<')) {
				// y from 0-49 maps to y from 149-100
				// x goes to 0
				// dir goes to >
				[x, y] = [0, 149-oldY]
				dir = dirs.indexOf('>')
			}
		}
		else if (oldXFace == 2 && oldYFace == 0) {
			// Face B -> up to F
			if (dir == dirs.indexOf('^')) {
				// x from 100-149 maps to x from 0-49
				// y goes to 199
				// dir remains ^
				[x, y] = [x-100, 199]
				dir = dirs.indexOf('^')
			} 
			// Face B -> right to E
			else if (dir == dirs.indexOf('>')) {
				// y from 0-49 maps to 149-100
				// x goes to 99
				// dir is <
				[x, y] = [99, 149-y]
				dir = dirs.indexOf('<')
			} 
			// Face B -> down to C
			else if (dir == dirs.indexOf('v')) {
				// x from 100-149 maps to y from 50-99
				// x goes to 99
				// dir is <
				[x, y] = [99, x-50]
				dir = dirs.indexOf('<')
			} 
		}
		else if (oldXFace == 1 && oldYFace == 1) {
			// Face C -> left to D
			if (dir == dirs.indexOf('<')) {
				// y from 50-99 maps to x from 0-49
				// y goes to 100
				// dir is v
				[x, y] = [y-50, 100]
				dir = dirs.indexOf('v')
			} 
			// Face C -> right to B
			else if (dir == dirs.indexOf('>')) {
				// y from 50-99 maps to x from 100-149
				// y goes to 49
				// dir is ^
				[x, y] = [y+50, 49]
				dir = dirs.indexOf('^')
			} 
		}
		else if (oldXFace == 0 && oldYFace == 2) {
			// Face D -> left to A
			if (dir == dirs.indexOf('<')) {
				// y from 100-149 maps to y from 49-0
				// x goes to 50
				// dir is >
				[x, y] = [50, 149-y]
				dir = dirs.indexOf('>')
			}
			// Face D -> up to C
			else if (dir == dirs.indexOf('^')) {
				// x from 0-49 maps to y from 50-99
				// x goes to 50
				// dir is >
				[x, y] = [50, x+50]
				dir = dirs.indexOf('>')
			}
		}
		else if (oldXFace == 1 && oldYFace == 2) {
			// Face E -> right to B
			if (dir == dirs.indexOf('>')) {
				// y from 100-149 maps to y from 49-0
				// x goes to 149
				// dir is <
				[x, y] = [149, 149-y]
				dir = dirs.indexOf('<')
			}
			// Face E -> down to F
			else if (dir == dirs.indexOf('v')) {
				// x from 50-99 maps to y from 150-199
				// x goes to 49
				// dir is <
				[x, y] = [49, 100+x]
				dir = dirs.indexOf('<')
			}
		}
		else if (oldXFace == 0 && oldYFace == 3) {
			// Face F -> left to A
			if (dir == dirs.indexOf('<')) {
				// y from 150-199 maps to x from 50-99
				// y goes to 0
				// dir is v
				[x, y] = [y-100, 0]
				dir = dirs.indexOf('v')
			} 
			// Face F -> down to B
			else if (dir == dirs.indexOf('v')) {
				// x from 0-49 maps to x from 100-149
				// y goes to 0
				// dir is v
				[x, y] = [x+100, 0]
				dir = dirs.indexOf('v')
			} 
			// Face F -> right to E
			else if (dir == dirs.indexOf('>')) {
				// y from 150-199 maps to x from 50-99
				// y goes to 149
				// dir is ^
				[x, y] = [y-100, 149]
				dir = dirs.indexOf('^')
			} 
		}
	} 

	if (map[y][x] == '#') {
		[x, y, dir] = [oldX, oldY, oldDir]
	}

	return [x, y, dir]
}

function partA(data) {
	let [map, instr] = data
	let [posX, posY, dir] = [0, 0, 0]
 
	while (map[posY][posX] == ' ') {
		posX++
	}

	let count = 0
	for (let [num, turn] of instr) {
		for (i=0; i < num; i++) {
			[posX, posY] = move(map, posX, posY, dir)
		}
		if (turn == 'L') dir = (dir+3) % 4
		if (turn == 'R') dir = (dir+1) % 4
		map[posY][posX] = dirs[dir]
	}

	return 1000 * (posY+1) + 4 * (posX+1) + dir
}

function partB(data) {
	let [map, instr] = data
	let [posX, posY, dir] = [0, 0, 0]
 
	while (map[posY][posX] == ' ') {
		posX++
	}

	let count = 0
	for (let [num, turn] of instr) {
		for (i=0; i < num; i++) {
			[posX, posY, dir] = cubeMove(map, posX, posY, dir)
		}
		if (turn == 'L') dir = (dir+3) % 4
		if (turn == 'R') dir = (dir+1) % 4
		map[posY][posX] = dirs[dir]
	}

	return 1000 * (posY+1) + 4 * (posX+1) + dir
}

console.log(partA(parse(test)))
console.log(partA(parse(input)))
console.log('--')
console.log(partB(parse(input)))
