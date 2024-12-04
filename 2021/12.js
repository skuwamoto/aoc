'use strict';
const fs = require('fs');

let testAText = fs.readFileSync('./test12a.txt', {encoding:'utf8', flag:'r'});
let testBText = fs.readFileSync('./test12b.txt', {encoding:'utf8', flag:'r'});
let testCText = fs.readFileSync('./test12c.txt', {encoding:'utf8', flag:'r'});
let inputText = fs.readFileSync('./input12.txt', {encoding:'utf8', flag:'r'});

let testA = testAText.split('\n')
let testB = testBText.split('\n')
let testC = testCText.split('\n')
let input = inputText.split('\n')

function makeMap(lines) {
	let map = {}
	for (let line of lines) {
		let [a, b] = line.split('-')

		if (!map[a]) map[a] = { visited: 0, paths: []}
		if (!map[b]) map[b] = { visited: 0, paths: []}

		map[a].paths.push(b)
		map[b].paths.push(a)
	}
	return map
}


function visit(map, curNode, canVisitTwice, pathSoFar) {
	if (curNode == 'end') {
		// console.log(pathSoFar)
		return 1
	}
	if (!map[curNode]) return 0

	let count = 0
	for (let nextNode of map[curNode].paths) {
		let notVisited = map[nextNode].visited == 0
		if (notVisited || (canVisitTwice && map[nextNode].visited == 1)) {
			if (nextNode.match(/[a-z]+/)) {
				map[nextNode].visited++
			}
			count += visit(map, nextNode, canVisitTwice && notVisited, pathSoFar + ',' + nextNode)
			if (nextNode.match(/[a-z]+/)) {
				map[nextNode].visited--
			}
		}
	}
	return count
}


function partA(lines) {
	let map = makeMap(lines)
	map['start'].visited = 2
	let count = visit(map, 'start', false, 'start')
	return count
}

function partB(lines) {
	let map = makeMap(lines)
	map['start'].visited = 2
	let count = visit(map, 'start', true, 'start')
	return count
}

console.log(partA(testA))
console.log(partA(testB))
console.log(partA(testC))
console.log(partA(input))

console.log('--')
console.log(partB(testA))
console.log(partB(testB))
console.log(partB(testC))
console.log(partB(input))
