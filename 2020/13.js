const fs = require('fs');

var fullText = fs.readFileSync('./13.txt', 'utf8')
var fullLines = fullText.trim().split('\n').map(x => x.trim())
var fullNums = fullLines.map(x => parseInt(x, 10))

var shortText = fs.readFileSync('./13short.txt', 'utf8')
var shortLines = shortText.trim().split('\n').map(x => x.trim())
var shortNums = shortLines.map(x => parseInt(x, 10))

function part1(lines) {
	let target = parseInt(lines[0], 10)
	let times = lines[1].split(',').filter(x => x != 'x').map(x => parseInt(x, 10))
	let minWait = 99999999999999
	let best = null
	for (let t of times) {
		if (t - (target % t) < minWait) {
			minWait = t - (target % t)
			best = t
		}
	}
	return best * minWait
}

function part2(lines) {
	let times = lines[1].split(',')
	let jump = BigInt(times[0])
	let targets = []

	for (let i=1; i < times.length; i++) {
		if (times[i] != 'x') {
			targets.push({
				offset: BigInt(i), 
				n: BigInt(times[i]),
				found: false
			})
			console.log('X +', i, 'is divisible by', times[i])
		}
	}

	let result = BigInt(0)
	let numFound = 0

	while (numFound < targets.length) {
		result = result + jump
		for (let t of targets) {
			if ((result + t.offset) % t.n == 0) {
				if (!t.found) {
					t.found = true
					jump *= t.n
					numFound++
				}
			} 
		}
	}

	return result
}



console.log('-----------------------------------------------------------------')
console.log('Part 1')
console.log(part1(shortLines))
console.log(part1(fullLines))
console.log('--')
console.log('Part 2')
console.log(part2(shortLines))
console.log(part2(fullLines))
// console.log('-----------------------------------------------------------------')
