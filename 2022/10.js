const fs = require('fs');

let test = fs.readFileSync('./test10.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input10.txt', {encoding:'utf8', flag:'r'});

let important = {
	20: true, 
	60: true,
	100: true,
	140: true,
	180: true,
	220: true
}

function parse(lines) {
	return lines.split('\n').map(x => x.split(' '))
}

function partA(lines) {
	let x = 1
	let sum = 0

	let toAdd = null
	for (let cycle = 1; cycle <= 220; cycle++) {

		if (important[cycle]) {
			sum += x * (cycle)
		}

		// Only grab an instruction if not in the middle of aadd.
		if (toAdd === null) {
			let instr = lines.shift()
			if (instr[0] == 'addx') {
				toAdd = Number(instr[1])
			}
		} else {
			x += toAdd
			toAdd = null
		}
	}
	return sum
}

function partB(lines) {
	let x = 1
	let sum = 0

	let toAdd = null
	let output = Array(6).fill('')

	for (let cycle = 1; cycle <= 240; cycle++) {
		let i = Math.floor((cycle-1) / 40)
		let xx = (cycle-1)%40

		if (Math.abs(xx-x) <= 1) {
			output[i] += '#'
		} else {
			output[i] += '.'
		}

		// Only grab an instruction if not in the middle of aadd.
		if (toAdd === null) {
			let instr = lines.shift()
			if (instr[0] == 'addx') {
				toAdd = Number(instr[1])
			}
		} else {
			x += toAdd
			toAdd = null
		}
	}
	return output.join('\n')
}

console.log(partA(parse(test)))
console.log(partA(parse(input)))
console.log('--')
console.log(partB(parse(test)))
console.log(partB(parse(input)))

