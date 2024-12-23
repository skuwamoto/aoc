const fs = require('fs');
const u = require('./util2')
let Grid = u.Grid

let test = fs.readFileSync('./test21.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input21.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    return lines.split('\n')
}

test = parse(test)
input = parse(input)

// console.log(test)
console.log()

function numPos(c) {
    switch (c) {
    case '7': return [0, 0]
    case '8': return [0, 1]
    case '9': return [0, 2]
    case '4': return [1, 0]
    case '5': return [1, 1]
    case '6': return [1, 2]
    case '1': return [2, 0]
    case '2': return [2, 1]
    case '3': return [2, 2]
    case ' ': return [3, 0]
    case '0': return [3, 1]
    case 'A': return [3, 2]       
    }
}

function dirPos(c) {
    switch (c) {
    case ' ': return [0, 0]
    case '^': return [0, 1]
    case 'A': return [0, 2]
    case '<': return [1, 0]
    case 'v': return [1, 1]
    case '>': return [1, 2]
    }
}

function equal(a, b) { return a[0] == b[0] && a[1] == b[1] }

function allMoves(from, to, posFunc) {
    if (equal(from, to)) return ['A']

    let moves = []
    let blankPos = posFunc(' ')

    if (from[0] != to[0]) {
        let next = [from[0] + Math.sign(to[0]-from[0]), from[1]]
        let nextChar = to[0] > from[0] ? 'v' : '^'

        if (!equal(next, blankPos)) {
            allMoves(next, to, posFunc).forEach(m => {
                moves.push(nextChar + m)
            })
        }
    }

    if (from[1] != to[1]) {
        let next = [from[0], from[1] + Math.sign(to[1]-from[1])]
        let nextChar = to[1] > from[1] ? '>' : '<'

        if (!equal(next, blankPos)) {
            allMoves(next, to, posFunc).forEach(m => {
                moves.push(nextChar + m)
            })
        }
    }

    return moves
}


function doPad(seq, posFunc) {
    // Get the current pos of the arm.
    let cur = posFunc('A')
    let result = ['']

    // For each letter in the sequence
    for (s of seq) {
        // Generate all moves that go to that letter.
        let next = posFunc(s)
        let moves = allMoves(cur, next, posFunc)

        // Add each of these onto every sequence already in the result.
        let nextResult = []
        for (let r of result) {
            for (let m of moves) {
                nextResult.push(r+m)
            }
        }
        cur = next
        result = nextResult
    }

    return result
}

function numPad(seq) {
    return doPad(seq, numPos)
}

function dirPad(seq) {
    return doPad(seq, dirPos)
}

function complexity(code, n) {
    // Get all possible numpad for first robot.
    let first = numPad(code)

    console.log(0, first[0])
    
    let current = first
    for (let i=0; i < n; i++) {
        // Get all possible dirpad for next robot.
        let next = current.map(seq => dirPad(seq))
        let best = 100000000000000000000

        // Find shortest sequence.
        next.forEach(s => {
            best = Math.min(best, s[0].length)
        })

        // Gather all shortest sequences.
        let bestNext = []
        next.forEach(s => {
            s.forEach(si => {
                if (si.length == best) {
                    bestNext.push(si)
                }            
            })
        })

        console.log(i+1, bestNext[0])
        current = bestNext
    }

    return current[0].length
}

function partA(info) {
    let sum = 0

    for (let code of info) {
        let c = complexity(code, 2)
        let num = Number(code.substring(0,code.length-1))

        console.log('code', code, 'complexity', c, 'number', num)
        sum += c * num
    }
    return sum
}

// ==================================

// From a sequence, returns a frequency map of sub-moves
// e.g., "<A<A<<AA" => { "<A": 2, "<<A": 1, "A": 1 }

function seqToMap(seq) {
    let map = new Map()
    for (let m of seq.substring(0, seq.length-1).split('A')) {
        let key = m + 'A'
        if (!map.has(key)) {
            map.set(key, 0)
        }
        map.set(key, map.get(key) + 1)
    }
    return map
}

function doPadB(seqMap, posFunc) {
    let result = new Map()

    // For each sub-sequence
    for (seq of seqMap.keys()) {
        let cur = posFunc('A')
        let c1 = 'A'

        // For each letter of that sub-sequence
        for (s of seq) {
            let next = posFunc(s)
            let moves = allMoves(cur, next, posFunc)
            let move

            if (moves.length == 1) move = moves[0]
            else if (c1 == '>' && s == '^') move = '<^A'
            else if (c1 == '^' && s == '>') move = 'v>A'
            else if (c1 == 'A' && s == 'v') move = '<vA'
            else if (c1 == 'v' && s == 'A') move = '^>A'
            else if (c1 == 'A' && s == '<') move = 'v<<A'
            else if (c1 == '<' && s == 'A') move = '>>^A'
            else {
                console.log('oops!', c1, s, moves)
                throw new Error()
            }
            // Record the count of how often this subsequence of moves occurs
            if (!result.has(move)) { 
                result.set(move, 0) 
            }

            result.set(move, result.get(move) + seqMap.get(seq))
            c1 = s
            cur = next
        }
    }

    return result
}

function numPadB(seqMap) {
    return doPadB(seqMap, numPos)
}

function dirPadB(seqMap) {
    return doPadB(seqMap, dirPos)
}

function complexityB(code, n) {
    // Get all possible numpad for first robot.
    let first = numPad(code)

    console.log(0, first)

    let best = 100000000000000000000000

    for (let f of first) {
        let current = seqToMap(f)
        for (let i=0; i < n; i++) {
            // Get all possible dirpad for next robot.
            let next = dirPadB(current)
            console.log(i+1, next)
            current = next
        }

        let sum = 0
        for (let key of current.keys()) {
            sum += current.get(key) * key.length
        }
        best = Math.min(best, sum)
    }

    return best
}



function partB(info) {
    let sum = 0

    for (let code of info) {
        let c = complexityB(code, 25)
        let num = Number(code.substring(0,code.length-1))

        console.log('code', code, 'complexity', c, 'number', num)
        sum += c * num
    }
    return sum
}

// console.log(partA(test))
console.log(partA(input))
console.log('------------------------')
console.log(partB(input))
console.log('------------------------')
// console.log(partBB(input))
