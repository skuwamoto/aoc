'use strict';
const fs = require('fs');

let testText = fs.readFileSync('./test14.txt', {encoding:'utf8', flag:'r'});
let inputText = fs.readFileSync('./input14.txt', {encoding:'utf8', flag:'r'});

let test = testText.split('\n')
let testPattern = test.shift()
test.shift()

let testMap = {}
test.map(x => x.split(' -> ')).forEach(x => testMap[x[0]] = x[1])

let input = inputText.split('\n')
let inputPattern = input.shift()
input.shift()

let inputMap = {}
input.map(x => x.split(' -> ')).forEach(x => inputMap[x[0]] = x[1])


function insertAt(str, i, toInsert) {
	return str.substring(0, i) + toInsert + str.substring(i)
} 

function addToMap(map, key, count) {
	if (!map[key]) map[key] = 0
	map[key] += count
	return map
}

function getCounts(str) {
	let counts = {}
	for (let i=0; i < str.length; i++) {
		addToMap(counts, str[i], 1)
	}
	return counts
}

function partA(pattern, map) {
	for (let n=0; n < 10; n++) {
		for (let i=0; i < pattern.length-1; i++) {
			let toInsert = map[pattern[i] + pattern[i+1]]
			if (toInsert) {
				pattern = insertAt(pattern, i+1, toInsert)
				i++
			}
		}
	}

	let counts = getCounts(pattern)
	let max = -1
	let min = -1

	for (let key of Object.keys(counts)) {
		if (max == -1 || counts[key] > max) max = counts[key]
		if (min == -1 || counts[key] < min) min = counts[key]
	}

	return max - min
}

function partB(pattern, map) {
	// Reduce the pattern to a set of pair frequencies
	let pairs = {}
	addToMap(pairs, '^' + pattern[0], 1)
	addToMap(pairs, pattern[pattern.length-1] + '$', 1)

	for (let i=0; i < pattern.length-1; i++) {
		addToMap(pairs, pattern[i] + pattern[i+1], 1)
	}

	// Reduce the map to a set of production rules for pairs
	let rules = {}
	for (let key of Object.keys(map)) {
		rules[key] = [key[0] + map[key], map[key] + key[1]]
	}
	rules['^' + pattern[0]] = ['^' + pattern[0]]
	rules[pattern[pattern.length-1] + '$'] = [pattern[pattern.length-1] + '$']

	console.log(rules)

	for (let n=0; n < 40; n++) {
		let newPairs = {}
		for (let key of Object.keys(pairs)) {
			addToMap(newPairs, rules[key][0], pairs[key])
			if (rules[key][1]) {
				addToMap(newPairs, rules[key][1], pairs[key])
			}
		}
		pairs = newPairs
	}

	let max = -1
	let min = -1

	let counts = {}
	for (let key of Object.keys(pairs)) {
		addToMap(counts, key[0], pairs[key])
		addToMap(counts, key[1], pairs[key])
	}

	delete counts['^']
	delete counts['$']

	let values = Object.values(counts) 
	values.sort((a,b) => a-b)

	return (values[values.length-1] - values[0]) / 2
}

console.log(partA(testPattern, testMap))
console.log(partA(inputPattern, inputMap))
console.log('--')
console.log(partB(testPattern, testMap))
console.log(partB(inputPattern, inputMap))
