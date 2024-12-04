'use strict';
const fs = require('fs');

let testText = fs.readFileSync('./test23.txt', {encoding:'utf8', flag:'r'});
let inputText = fs.readFileSync('./input23.txt', {encoding:'utf8', flag:'r'});

let test = { board: text2board(testText), score: 0, moves: [] }
let input = { board: text2board(inputText), score: 0, moves: [] }

const creatureInfo = {
	'A': { cost: 1, goal: 3 },
	'B': { cost: 10, goal: 5 },
	'C': { cost: 100, goal: 7 },
	'D': { cost: 1000, goal: 9 },
}

const infinity = 1_000_000_000_000

const smallRooms = [[2, 3], [3, 3], [2, 5], [3, 5], [2, 7], [3, 7], [2, 9], [3, 9]]
const bigRooms = [[2, 3], [3, 3], [4, 3], [5, 3], [2, 5], [3, 5], [4, 5], [5, 5], [2, 7], [3, 7], [4, 7], [5, 7], [2, 9], [3, 9], [4, 9], [5, 9]]
const hallway = [[1, 1], [1, 2], [1, 4], [1, 6], [1, 8], [1, 10], [1, 11]]

function text2board(text) {
	return text.split('\n')
}

function board2text(board) {
	return board.join('\n')
}

function setCharAt(board, i, j, c) {
	board[i] = board[i].substring(0, j) + c + board[i].substring(j+1)
}

let seen = {}
let tryCount = 0

function tryMove(state, i, j, k, l, stackLen) {
	const creature = state.board[i][j]
	const cost = creatureInfo[creature].cost

	let curI = i
	let curJ = j

	// Move up first if needed.
	while (curI > k) {
		curI--
		if (state.board[curI][curJ] != '.') return null
	}

	// Move left/right.
	while (curJ != l) {
		curJ = (l < curJ) ? curJ-1 : curJ+1
		if (state.board[curI][curJ] != '.') return null
	}

	// Then move down.
	while (curI < k) {
		curI++
		if (state.board[curI][curJ] != '.') return null
	}

	const score = cost * (Math.abs(i-k) + Math.abs(j-l))

	// We found no obstacles. Make a copy of the existing state.
	let newState = { board: text2board(board2text(state.board)), score: state.score, moves: state.moves.concat() }

	// Swap characters.
	setCharAt(newState.board, k, l, state.board[i][j])
	setCharAt(newState.board, i, j, '.')

	// Add the move cost and the move to our state.
	newState.score += score
	newState.moves.push(`${creature} [${i},${j}] -> [${k},${l}]`)

	// Check to see if the board is the best score we've seen already.
	const bestSeen = seen[board2text(newState.board)]
	if (bestSeen && bestSeen <= newState.score) {
		return null
	}

	tryCount++
	if (tryCount % 1000 == 0) {
		console.log('iterations:', tryCount, 'queue:', stackLen)
	}

	// Store the best score for this board.
	seen[board2text(newState.board)] = newState.score

	// Return the board
	return newState
}

function isWinningState(state) {
	let rooms = state.board.length == 5 ? smallRooms : bigRooms

	// Victory state
	for (let [i, j] of rooms) {
		let creature = state.board[i][j]
		if (!isCreature(creature) || creatureInfo[creature].goal != j) return false
	}
	return true
}

function isCreature(char) {
	return char == 'A' || char == 'B' || char == 'C' || char == 'D'
}

function isPartiallySolved(state, i, j) {
	for ( ; state.board[i][j] != '#'; i++) {
		let creature = state.board[i][j]
		if (!isCreature(creature) || creatureInfo[creature].goal != j) return false
	}
	return true
}

function bestScore(state) {
	let rooms = state.board.length == 5 ? smallRooms : bigRooms
	let stack = []

	stack.push(state)

	let best = infinity

	while (stack.length) {
		state = stack.pop()

		if (isWinningState(state)) {
			console.log('found winner!', state.score, state.moves)
			best = Math.min(best, state.score)
			continue;
		} 

		else if (state.score >= best) {
			continue;
		}

		// Move type 1: from room to hallway
		for (let [i, j] of rooms) {
			let cur = state.board[i][j]
			if (isCreature(cur)) {
				// Don't move creatures out if the room is partially solved.
				if (isPartiallySolved(state, i, j)) continue

				// Add moves from this room to each hallway space.
				for (let [k, l] of hallway) {
					let newState = tryMove(state, i, j, k, l, stack.length)
					if (newState) {
						stack.push(newState)
					} 
				}
			}
		}

		// Move type 2: hallway into room
		for (let [i, j] of hallway) {
			let cur = state.board[i][j]
			for (let [k, l] of rooms) {
				// Certain amphipods only want to go into certain rooms.
				if (isCreature(cur) && l == creatureInfo[cur].goal) {
					// Only move to rooms that are partially solved. 
					if (!isPartiallySolved(state, k+1, l)) continue

					let newState = tryMove(state, i, j, k, l, stack.length)
					if (newState) {
						stack.push(newState)
					} 
				}
			}
		}
	}

	return best
}

function partA(state) {
	seen = {}
	let start = Date.now()
	let result = bestScore(state)
	console.log('took', (Date.now()-start) / 1000, 'seconds')
	return result
}

function partB(state) {
	seen = {}
	let start = Date.now()

	let newBoard = text2board(board2text(state.board))
	let row1 = "  #D#C#B#A#  "
	let row2 = "  #D#B#A#C#  "

	newBoard.splice(3, 0, row1, row2)

	let expandedState = { board: newBoard, score: 0, moves: [] }

	let result = bestScore(expandedState)
	console.log('took', (Date.now()-start) / 1000, 'seconds')
	return result
}

// console.log(partA(test))
// console.log(partA(input))
// console.log('--')
// console.log(partB(test))
console.log(partB(input))
