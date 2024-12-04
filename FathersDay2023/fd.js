const fs = require('fs');

let test = fs.readFileSync('./test.txt', 'utf8');
let input = fs.readFileSync('./input.txt', 'utf8');

function parse(lines) {
	let out = lines.split('\n\n')
	out[0] = out[0].split('\n').map(x => x.split('').map(Number))
	out[1] = out[1].split('\n')
	return out
}

function partA(args) {
	let [grid, instructions] = args
	let [x, y] = [0, 0]
	let hasKibble = false

	for (let step of instructions) {
		switch (step) {
		case 'left': x--; break;
		case 'right': x++; break
		case 'up': y--; break;
		case 'down': y++; break;
		case 'bark': 
			grid[y][x] += (hasKibble) ? 1 : -1;
			hasKibble = !hasKibble
			break
		}
	}

	for (let i=0; i < grid.length; i++) {
		let str = ''
		for (let j=0; j < grid[i].length; j++) {
			str += (grid[i][j] == 0) ? '.' : '#'
		}
		console.log(str)
	}


}

partA(parse(input))

