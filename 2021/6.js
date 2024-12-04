const fs = require('fs');

let test = fs.readFileSync('./test6.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input6.txt', {encoding:'utf8', flag:'r'});

test = test.split(',')
input = input.split(',')

function countsToMap(counts) {
	let map = {}
	for (fish of counts) {
		if (!map[fish]) map[fish] = 0
		map[fish]++
	}
	return map
}

function add(map, key, val) {
	if (!map[key]) map[key] = 0
	map[key] += val
}

function iterateMap(map) {
	let newMap = {}
	for (key in map) {
		let num = Number(key)
		if (num == 0) {
			add(newMap, '6', map[key])
			add(newMap, '8', map[key])
		}
		else {
			add(newMap, String(num-1), map[key])
		}
	}
	return newMap
}

function countFish(map) {
	let count = 0
	for (val in map) {
		count += Number(map[val])
	}
	return count
}

function partA(counts) {
	let map = countsToMap(counts)
	for (let i=0; i < 80; i++) {
		map = iterateMap(map)
	}

	return countFish(map)
}

function partB(counts) {
	let map = countsToMap(counts)
	for (let i=0; i < 256; i++) {
		map = iterateMap(map)
	}

	return countFish(map)
}

console.log(partA(test))
console.log(partA(input))
console.log('--')
console.log(partB(test))
console.log(partB(input))
