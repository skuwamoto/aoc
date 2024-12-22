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

        console.log(n+1, bestNext[0])
        current = bestNext
    }

    return current[0].length
}


function doPadBB(map, posFunc) {
    // Get the current pos of the arm.
    let badRow = posFunc('A')[0]
    let result = new Map()
    let cur = posFunc('A')

    // console.log('getting sequence for', seq)

    // For each letter in the sequence
    for (let seq of map.keys()) {
        for (let s of seq) {
            // console.log('trying', s)
            // Generate a move that goes to that letter.
            let next = posFunc(s)
            let move = []

            // If this is on a row with the bad square, we 
            // go vertical first, then horizontal.
            // Ortherwise, the reverse.
            if (cur[0] == badRow) {
                while (cur[0] < next[0]) { move.push('v'); cur[0]++ }
                while (cur[0] > next[0]) { move.push('^'); cur[0]-- }
                while (cur[1] < next[1]) { move.push('>'); cur[1]++ }
                while (cur[1] > next[1]) { move.push('<'); cur[1]-- }
            } else {
                while (cur[1] < next[1]) { move.push('>'); cur[1]++ }
                while (cur[1] > next[1]) { move.push('<'); cur[1]-- }
                while (cur[0] < next[0]) { move.push('v'); cur[0]++ }
                while (cur[0] > next[0]) { move.push('^'); cur[0]-- }
            }

            // condense the move into a string
            move = move.join('') + 'A'

            // store it in the map
            let prev = result.has(move) ? result.get(move) : 0
            result.set(move, prev+map.get(seq))
        }
    }

    // Returns a map of all sequences found in the moves.
    return result
}

function numPadBB(map) {
    return doPadBB(map, numPos)
}

function dirPadBB(map) {
    return doPadBBB(map, dirPos)
}

function doPadBBB(map, posFunc) {
    // Get the current pos of the arm.
    let badRow = posFunc('A')[0]
    let result = new Map()

    // console.log('getting sequence for', seq)

    // For each letter in the sequence
    for (let seq of map.keys()) {
        let c1 = 'A'

        for (let c2 of seq) {
            // console.log('trying', s)
            // Generate a move that goes to that letter.
            let move = ''

            // If this is on a row with the bad square, we 
            // go vertical first, then horizontal.
            // Otherwise, the reverse.

            if (c1 == '^' && c2 == 'A')      move += '>'
            else if (c1 == '^' && c2 == 'v') move += 'v'
            else if (c1 == 'A' && c2 == '^') move += '<'
            else if (c1 == 'A' && c2 == '>') move += 'v'
            else if (c1 == '<' && c2 == 'v') move += '>'
            else if (c1 == '<' && c2 == '>') move += '>>'
            else if (c1 == 'v' && c2 == '<') move += '<'
            else if (c1 == 'v' && c2 == '^') move += '^'
            else if (c1 == 'v' && c2 == '>') move += '>'
            else if (c1 == '>' && c2 == 'A') move += '^'
            else if (c1 == '>' && c2 == '<') move += '<<'
            else if (c1 == '>' && c2 == 'v') move += '<'

            else if (c1 == '>' && c2 == '^') move += '<^'
            else if (c1 == '^' && c2 == '>') move += 'v>'
            else if (c1 == 'A' && c2 == 'v') move += '<v'
            else if (c1 == 'v' && c2 == 'A') move += '^>'
            else if (c1 == 'A' && c2 == '<') move += 'v<<'
            else if (c1 == '<' && c2 == 'A') move += '>>^'
            else {
                if (c1 != c2) {
                    throw new Error()
                }
            }

            move += 'A'

            // store it in the map
            let prev = result.has(move) ? result.get(move) : 0
            result.set(move, prev+map.get(seq))
        }
    }

    // Returns a map of all sequences found in the moves.
    return result
}

function complexityBB(code, n) {
    // Get a sequence for the first robot.
    let first = numPad(code)

    console.log(0, first)

    let best = 10000000000000000000
    for (let f of first) {
        let current = new Map()
        let key = ''
        for (let fi of f) {
            key += fi
            if (fi == 'A') {
                if (!current.has(key)) current.set(key, 0) 
                current.set(key, current.get(key)+1)
                key = ''
            }
        }
        // console.log(0, current)

        for (let i=0; i < n; i++) {
            current = dirPadBB(current)
            console.log(i+1, current)
        }

        // the length = the length of all keys * number of times used
        let sum = 0
        for (let seq of current.keys()) {
            sum += seq.length * current.get(seq)
        }
        if (sum < best) {
            best = sum
            console.log('best is now', best)
        }
    }
    return best
}

function partA(info) {
    let sum = 0

    for (let code of info) {
        let c = complexity(code)
        let num = Number(code.substring(0,code.length-1))

        console.log('code', code, 'complexity', c, 'number', num)
        sum += c * num
    }
    return sum
}

function partBB(info) {
    let sum = 0

    for (let code of info) {
        let c = complexityBB(code, 2)
        let num = Number(code.substring(0,code.length-1))

        console.log('code', code, 'complexity', c, 'number', num)
        sum += c * num
    }
    return sum
}

// console.log(partA(test))
console.log(partA(input))
console.log('------------------------')
// console.log(partB(input))
console.log('------------------------')
// console.log(partBB(input))
