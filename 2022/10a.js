const fs = require('fs');

let test = fs.readFileSync('./test10.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input10.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
	return lines.split('\n').map(x => x.split(' '))
}

function getMoves(lines) {
	let xx = [1]

	for (let l of lines) {
		xx.push(xx.at(-1))
		if (l[0] == 'addx') {
			xx.push(xx.at(-1) + Number(l[1]))
		}
	}
	return xx
}

function partA(lines) {
	let xx = getMoves(lines)
	return [20, 60, 100, 140, 180, 220].reduce((arr, i) => arr + i * xx[i-1], 0)
}

function partB(lines) {
	let xx = getMoves(lines)
	let result = ""
	for (let i = 0; i < xx.length; i++) {
		result += Math.abs(i%40-xx[i]) <= 1 ? '#' : '.'
		if (i%40 == 39) result += '\n'
	}
	return result
}

console.log(partA(parse(test)))
console.log(partA(parse(input)))
console.log('--')
console.log(partB(parse(test)))
console.log(partB(parse(input)))

