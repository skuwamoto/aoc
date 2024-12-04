'use strict';
const fs = require('fs');

let testText = fs.readFileSync('./test23.txt', {encoding:'utf8', flag:'r'});
let inputText = fs.readFileSync('./input23.txt', {encoding:'utf8', flag:'r'});

let test = process(testText)
let input = process(inputText)

let debugging = false

const costMap = {
	'A': 1,
	'B': 10,
	'C': 100,
	'D': 1000
}

const infinity = 1_000_000_000_000

// const rooms = [[2, 3], [3, 3], [2, 5], [3, 5], [2, 7], [3, 7], [2, 9], [3, 9]]
const rooms = [[2, 3], [3, 3], [4, 3], [5, 3], [2, 5], [3, 5], [4, 5], [5, 5], [2, 7], [3, 7], [4, 7], [5, 7], [2, 9], [3, 9], [4, 9], [5, 9]]
const hallway = [[1, 1], [1, 2], [1, 4], [1, 6], [1, 8], [1, 10], [1, 11]]

const goal = [ '.', '.', 'A', '.', 'B', '.', 'C', '.', 'D']

function process(text) {
	return {
		board: text2board(text),
		score: 0,
		moves: []
	}
}

function text2board(text) {
	return text.split('\n').map(x => x.split(''))
}

function board2text(board) {
	return board.map(x => x.join('')).join('\n')
}

let seen = {}
let tryCount = 0
let goodCount = 0
let badCount = 0
let improvedCount = 0
let freq = 1000

function tryMove(state, i, j, k, l, stackLen) {
	let newState = { board: text2board(board2text(state.board)), score: state.score, moves: state.moves.concat() }
	let creature = state.board[i][j]
	let cost = costMap[creature]

	if (!cost) throw new Error('tried to move a non-creature')

	// If currently in a room, do vertical move first.
	let vertFirst = (i > 1) 

	let score = 0

	let curI = i
	let curJ = j

	if (i == 1 && j == 6 && creature == 'C' && k == 2 && state.board[2][7] == '.' && state.board[3][7] == 'C') {
		// debugging = true
		// console.log('trying to move C')
		// console.log(board2text(state.board))
	}

	if (vertFirst) {
		// Move up/down until we hit the target.
		while (curI != k) {
			curI = (k < curI) ? curI-1 : curI+1
			if (state.board[curI][curJ] != '.') return null
			score += cost
		}
	}

	// Move left/right until we hit the target.
	while (curJ != l) {
		curJ = (l < curJ) ? curJ-1 : curJ+1
		if (state.board[curI][curJ] != '.') return null
		score += cost
	}

	if (!vertFirst) {
		// Move up/down until we hit the target.
		while (curI != k) {
			curI = (k < curI) ? curI-1 : curI+1
			if (state.board[curI][curJ] != '.') return null
			score += cost
		}
	}

	// No obstacles.
	newState.board[k][l] = state.board[i][j]
	newState.board[i][j] = '.'

	if (debugging) console.log("no obstacles!")

	newState.score += score
	newState.moves.push(`${creature} [${i},${j}] -> [${k},${l}]`)

	// Check to see if the board is one we've seen already.
	let bestSeen = seen[board2text(newState.board)]
	tryCount++
	if (!bestSeen) {
		goodCount++
	} else if (bestSeen > newState.score) {
		improvedCount++
	} else {
		badCount++
		if (debugging) {
			console.log('board was already seen', 'saved', bestSeen, 'new', newState.score)
			console.log(board2text(newState.board))
		}
		return null
	}

	if (tryCount % freq == 0) {
		console.log('tried:', tryCount, 'new:', goodCount, 'improved:', improvedCount, 'rejected:', badCount, 'queue:', stackLen)
	}

	seen[board2text(newState.board)] = newState.score

	if (debugging) {
		console.log("not a repeat!")
		console.log(board2text(newState.board))
	}

	// Return the board
	return newState
}

function isWinningState(state) {
	// Victory state
	for (let [i, j] of rooms) {
		if (state.board[i][j] != goal[j]) return false
	}
	return true
}

function calcScore(state) {
	return state.moves.length * 100000 + state.score
}

function addState(stack, state) {
	stack.push(state)
	return;

	if (stack.length == 0) {
		stack.push(state)
	} else if (calcScore(state) <= calcScore(stack[0])) {
		stack.unshift(state)
	} else if (calcScore(state) >= calcScore(stack[stack.length-1])) {
		stack.push(state)
	} else {
		let lo = 0
		let hi = stack.length-1

		while (hi-lo > 1) {
			let mid = Math.floor((hi+lo) / 2)
			if (calcScore(state) < calcScore(stack[mid])) {
				hi = mid
			} else {
				lo = mid
			}
		}

		stack.splice(lo+1, 0, state)
	}
	assertSorted(stack)
}

function printScores(stack) {
	console.log('[', stack.map(x => x.score).join(', '), ']')
}

function isSorted(stack) {
	let last = -1
	for (let s of stack) {
		if (calcScore(s) < last) return false
		last = calcScore(s)
	}
	return true
}

function assertSorted(stack) {
	if (!isSorted(stack)) throw new Error('not sorted')
}

function bestScore(state) {
	let stack = []

	stack.push(state)

	let best = infinity

	while (stack.length) {
		state = stack.shift()

		if (isWinningState(state)) {
			console.log('found winner!', state.score, state.moves)
			best = Math.min(best, state.score)
			continue;
		} 

		else if (state.score >= best) {
			// console.log('throwing this out', state.score)
			continue;
		}

		// Move type 1: out from hallway
		for (let [i, j] of rooms) {
			let cur = state.board[i][j]
			for (let [k, l] of hallway) {
				if (cur == 'A' || cur == 'B' || cur == 'C' || cur == 'D') {
				// if (cur == 'B' || cur == 'C') {
					let newState = tryMove(state, i, j, k, l, stack.length)
					if (newState) {
						addState(stack, newState)
					} 

					if (debugging) {
						if (newState) {
							console.log('adding')
							console.log(board2text(newState.board))							

						}
						else {
							console.log("Can't move", cur, `from [${i}, ${j}] -> [${k}, ${l}]`)
						}
					}
				}
			}
		}

		// Move type 2: hallway into room
		for (let [i, j] of hallway) {
			let cur = state.board[i][j]
			for (let [k, l] of rooms) {
				// Certain amphipods only want to go into certain rooms.
				if (cur == 'A' && l == 3 || cur == 'B' && l == 5 || cur == 'C' && l == 7 || cur == 'D' && l == 9) {
				// if (cur == 'B' && l == 5 || cur == 'C' && l == 7) {
					let newState = tryMove(state, i, j, k, l, stack.length)
					if (newState) {
						addState(stack, newState)
					}
					if (debugging) {
						if (newState) {
							console.log('adding')
							console.log(board2text(newState.board))							

						}
						else {
							console.log("Can't move", cur, `from [${i}, ${j}] -> [${k}, ${l}]`)
						}
					}
				}
			}
		}

		if (tryCount % freq == 0) {
			console.log('sort here', tryCount)
			stack.sort((a,b) => calcScore(a) - calcScore(b))
			assertSorted(stack)
		}

		debugging = false
	}

	return best
}

function partA(state) {
	return bestScore(state)
}

function partB(state) {
	let newBoard = text2board(board2text(state.board))
	let row1 = "  #D#C#B#A#  ".split('')
	let row2 = "  #D#B#A#C#  ".split('')

	newBoard.splice(3, 0, row1, row2)

	let expandedState = { board: newBoard, score: 0, moves: [] }

	return bestScore(expandedState)
}

// console.log(partA(test))
// console.log(partA(input))
// console.log('--')
console.log(partB(test))
// console.log(partB(input))
