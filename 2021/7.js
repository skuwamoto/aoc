const fs = require('fs');

let test = fs.readFileSync('./test7.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input7.txt', {encoding:'utf8', flag:'r'});

test = test.split(',').map(Number)
input = input.split(',').map(Number)



function partA(crabs) {
	let max = -1000000
	let min = 1000000

	for (let c of crabs) {
		if (c < min) min = c
		if (c > max) max = c
	}

	let minFuel = 1000000
	for (let pos = min; pos <= max; pos++) {
		let fuel = 0
		for (let c of crabs) {
			fuel += Math.abs(c-pos)
		}
		if (fuel < minFuel) minFuel = fuel
	}

	return minFuel
}

function cost(n) {
	let cost = 0
	let step = 1
	while (n > 0) {
		cost += step
		step++
		n--
	}
	return cost
}

function partB(crabs) {
	let max = -1000000
	let min = 10000000000

	for (let c of crabs) {
		if (c < min) min = c
		if (c > max) max = c
	}

	let minFuel = 10000000000
	for (let pos = min; pos <= max; pos++) {
		let fuel = 0
		for (let c of crabs) {
			fuel += cost(Math.abs(c-pos))
		}
		if (fuel < minFuel) minFuel = fuel
	}

	return minFuel
}

console.log(partA(test))
console.log(partA(input))
console.log('--')
console.log(partB(test))
console.log(partB(input))
