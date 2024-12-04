'use strict';
const fs = require('fs');

function roll(p, die) {
	let move = 0

	for (let i=0; i < 3; i++) {
		move += die.val
		die.val++
		die.nRolls++
		if (die.val == 101) die.val = 1
	}

	p.pos += move
	while (p.pos > 10) p.pos -= 10

	p.score += p.pos

	return [p, die]
}


function partA(pos1, pos2) {
	let p1 = { pos: pos1, score: 0 }
	let p2 = { pos: pos2, score: 0 }

	let die = {val: 1, nRolls: 0 }

	while (p1.score < 1000 && p2.score < 1000) {
		[p1, die] = roll(p1, die)

		if (p1.score < 1000) {
			[p2, die] = roll(p2, die)
		}
	}

	if (p1.score >= 1000) {
		return(p2.score * die.nRolls)
	} else {
		return(p1.score * die.nRolls)
	}
}

let cache = {}


function partB(pos1, pos2) {
	return rollB({ pos: pos1, score: 0 }, { pos: pos2, score: 0 }, true)
}

function moveBy(p, move) {
	let pos = p.pos + move
	while (pos > 10) pos -= 10

	return { pos: pos, score: p.score + pos }
}

function rollB(p1, p2, turn1) {
	if (p1.score >= 21) return [1, 0]
	if (p2.score >= 21) return [0, 1]

	let key = "" + p1.pos + ':' + p1.score + ':' + p2.pos + ':' + p2.score + ':' + turn1
	if (cache[key]) return cache[key]

	let result = [0, 0]

	for (let i=1; i <= 3; i++) {
		for (let j=1; j <=3; j++) {
			for (let k=1; k <=3; k++) {
				let move = i + j + k
				let wins

				if (turn1) {
					wins = rollB(moveBy(p1, move), p2, false)
				} else {
					wins = rollB(p1, moveBy(p2, move), true)
				}
				result[0] += wins[0]
				result[1] += wins[1]
			}
		}
	}

	cache[key] = result
	return result
}

console.log(partA(4, 8))
console.log(partA(8, 3))
console.log('--')
console.log(partB(4, 8))
console.log(partB(8, 3))
