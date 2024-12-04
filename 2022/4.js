const fs = require('fs');

let test = fs.readFileSync('./test4.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input4.txt', {encoding:'utf8', flag:'r'});

function parseInput(lines) {
	return lines.split('\n').map(x => x.split(',').map(x => x.split('-').map(Number)))
}

test = parseInput(test)
input = parseInput(input)

function partA(lines) {
	let count = 0
	for (let l of lines) {
		let [a,b] = l
		let [aLo, aHi] = a
		let [bLo, bHi] = b

		if ((aLo >= bLo && aHi <= bHi) || (bLo >= aLo && bHi <= aHi)) {

			console.log('contains', a, b, aLo >= bLo && aHi <= bHi, bLo >= aLo && bHi <= aHi)
			count++
		}
	}
	return count
}

function partB(lines) {
	let count = 0
	for (let l of lines) {
		let [a,b] = l
		let [aLo, aHi] = a
		let [bLo, bHi] = b

		if (aHi < bLo || bHi < aLo) {
		}
		else {
			count ++
		}
	}
	return count
}

console.log(partA(test))
console.log(partA(input))
console.log('--')
console.log(partB(test))
console.log(partB(input))

