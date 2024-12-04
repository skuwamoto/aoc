const fs = require('fs');

let test = fs.readFileSync('./test16.txt', 'utf8');
let input = fs.readFileSync('./input16.txt', 'utf8');

function parse(lines) {
	let result = {}
	lines = lines.split('\n')
	for (let l of lines) {
		let m = l.match(/Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.*)/)
		result[m[1]] = {
			rate: Number(m[2]),
			exits: m[3].split(', ')
		}
	}

	return result
}

function bestScore(rules, pos, open, movesLeft, cache, numValves) {
	if (movesLeft <= 0) return [0, 'done']

	let keys = Object.keys(open)
	if (keys.length == numValves) return [0, 'done']

	keys.sort()
	let key = keys.join()+':'+pos+':'+movesLeft

	// console.log('trying', key)

	if (!cache[key]) {
		let best = -1
		let bestMoves = ''

		let r = rules[pos]
		if (!open[pos] && r.rate) {
			let flow = r.rate * (movesLeft-1)
			// console.log('opening', pos)
			open[pos] = true
			let [b, moves] = bestScore(rules, pos, open, movesLeft-1, cache, numValves)
			best = b + flow
			bestMoves = ' (open) -> ' + moves
			delete open[pos]
		}
		for (let e of r.exits) {
			let [b, moves] = bestScore(rules, e, open, movesLeft-1, cache, numValves)
			if (b > best) {
				best = b
				bestMoves = pos + ' -> ' + moves
			}
		}

		cache[key] = [best, bestMoves]
	}

	return cache[key]
}

function bestScoreB(rules, numValves) {
	let queue = [{
		pos1: 'AA',
		pos2: 'AA',
		open: [],
		movesLeft: 26,
		pressure: 0,
		moves: ''
	}]

	let best = 0
	let bestMoves = ''

	let count = 0
	while (queue.length) {
		if (count % 10000 == 0) {
			queue.sort((a,b) => b.pressure-a.pressure)
			if (queue.length > 100000) {
				queue.length = 100000
			}
		}
		if (count % 1000 == 0) {
			console.log(queue.length)
		}
		count++

		let {pos1, pos2, open, movesLeft, pressure, moves} = queue.shift() 
		let r1 = rules[pos1]
		let r2 = rules[pos2]

		function add(obj) {
			queue.push(obj)
			if (obj.pressure > best) {
				best = queue.at(-1).pressure
				bestMoves = queue.at(-1).moves
				console.log(best, bestMoves)
			}
		}

		movesLeft--
		if (movesLeft > 0 && open.length < numValves) {
			if (!open.includes(pos1) && r1.rate) {
				if (pos1 != pos2 && !open.includes(pos2) && r2.rate) {
					add({
						pos1,
						pos2,
						open: [pos1, pos2].concat(open),
						movesLeft: movesLeft,
						pressure: pressure + (r1.rate + r2.rate) * movesLeft,
						moves: moves + 'open ' + pos1 + ', open ' + pos2 + '\n'
					})
				}
				for (let e2 of r2.exits) {
					add({
						pos1,
						pos2: e2,
						open: [pos1].concat(open),
						movesLeft,
						pressure: pressure + r1.rate * movesLeft,
						moves: moves + 'open ' + pos1 + ', move to ' + e2 + '\n'
					})
				}
			}
			for (let e1 of r1.exits) {
				if (!open.includes(pos2) && r2.rate) {
					add({
						pos1: e1,
						pos2,
						open: [pos2].concat(open),
						movesLeft,
						pressure: pressure + r2.rate * movesLeft,
						moves: moves + 'move to ' + e1 + ', open ' + pos2 + '\n'
					})
				}
				for (let e2 of r2.exits) {
					add({
						pos1: e1,
						pos2: e2,
						open,
						movesLeft,
						pressure,
						moves: moves + 'move to ' + e1 + ', move to ' + e2 + '\n'
					})
				}
			}
		}
	}
	return [best, bestMoves]
}

function partA(rules, numValves) {
	return bestScore(rules, 'AA', {}, 30, {}, numValves)
}

function partB(rules, numValves) {
	return bestScoreB(rules, numValves)
}

console.log(partA(parse(test), 6))
console.log(partA(parse(input), 14))
console.log('--')
// console.log(partB(parse(test), 6))
// console.log(partB(parse(input), 14))

