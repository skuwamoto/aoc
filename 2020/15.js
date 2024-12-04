const fs = require('fs');

var fullText = fs.readFileSync('./15.txt', 'utf8')
var fullLines = fullText.trim().split(',').map(x => parseInt(x, 10))

var shortText = fs.readFileSync('./15short.txt', 'utf8')
var shortLines = shortText.trim().split(',').map(x => parseInt(x, 10))

function part1(lines) {
	let time1 = []
	let time2 = []
	let turn = 1
	let prev = null

	for (let l of lines) {
		time1[l] = time2[l]
		time2[l] = turn
		turn++
		prev = l
	}

	while (turn <= 2020) {
		let next = typeof(time1[prev]) != 'undefined' ? time2[prev] - time1[prev] : 0
		time1[next] = time2[next]
		time2[next] = turn
		prev = next
		turn++
	}
	return(prev)
}

function part2(lines) {
	let time1 = {}
	let time2 = {}
	let turn = 1
	let prev = null

	for (let l of lines) {
		time1[l] = time2[l]
		time2[l] = turn
		turn++
		prev = l
	}

	while (turn <= 30000000) {
		let next = typeof(time1[prev]) != 'undefined' ? time2[prev] - time1[prev] : 0
		time1[next] = time2[next]
		time2[next] = turn
		prev = next
		turn++
		if (turn % 100000 === 0) {
			console.log('turn', turn)
		}
	}
	return(prev)
}



console.log('-----------------------------------------------------------------')
console.log('Part 1')
// console.log(part1(shortLines))
console.log(part1(fullLines))
console.log('--')
// console.log('Part 2')
// console.log(part2(shortLines))
console.log(part2(fullLines))
console.log('-----------------------------------------------------------------')
