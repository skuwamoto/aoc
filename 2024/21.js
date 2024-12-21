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

function doPad(seq, posFunc) {
    // Get the current pos of the arm.
    let cur = posFunc('A')
    let result = ['']

    // console.log('getting sequence for', seq)

    // For each letter in the sequence
    for (s of seq) {
        // console.log('trying', s)
        // Generate a move that goes to that letter.
        let next = posFunc(s)
        let move = []
        let orig = cur.concat()

        while (cur[0] < next[0]) { move.push('v'); cur[0]++ }
        while (cur[0] > next[0]) { move.push('^'); cur[0]-- }
        while (cur[1] < next[1]) { move.push('>'); cur[1]++ }
        while (cur[1] > next[1]) { move.push('<'); cur[1]-- }

        // Generate all unique permutations of that move.
        move = move.join('')

        let moves = move.permute().unique()

        // Filter out sequences that touch the danger square.
        let badPos = posFunc(' ')
        moves = moves.filter(m => {
            let pos = orig.concat()
            let bad = false
            for (let mi of m) {
                switch (mi) {
                case '<':
                    pos[1] -= 1
                    break
                case '>':
                    pos[1] += 1
                    break
                case '^':
                    pos[0] -= 1
                    break
                case 'v':
                    pos[0] += 1
                    break
                }
                if (pos[0] == badPos[0] && pos[1] == badPos[1]) {
                    bad = true
                }
            }
            return !bad
        })

        if (moves.length == 0) moves = ['']

        // Add an 'A' to the end of every move.
        moves = moves.map(x => x + 'A')

        // console.log('moves =', moves)

        // Add each of these onto every sequence already in the result.
        let nextResult = []
        for (let r of result) {
            for (let m of moves) {
                nextResult.push(r+m)
            }
        }
        result = nextResult
    }

    // console.log('result =', result)
    // console.log()

    return result
}

function doOnePad(seq, posFunc) {
    // Get the current pos of the arm.
    let cur = posFunc('A')
    let result = ''

    // console.log('getting sequence for', seq)

    // For each letter in the sequence
    for (s of seq) {
        // console.log('trying', s)
        // Generate a move that goes to that letter.
        let next = posFunc(s)
        let move = []
        while (cur[0] < next[0]) { move.push('v'); cur[0]++ }
        while (cur[0] > next[0]) { move.push('^'); cur[0]-- }
        while (cur[1] < next[1]) { move.push('>'); cur[1]++ }
        while (cur[1] > next[1]) { move.push('<'); cur[1]-- }

        result = result + move.join('') + 'A'
    }

    // console.log('result =', result)
    // console.log()

    return result
}

function numericPad(seq) {
    return doPad(seq, numPos)
}

function dirPad(seq) {
    return doPad(seq, dirPos)
}

function oneDirPad(seq) {
    return doOnePad(seq, dirPos)
}


// Move from initial position (A) using <>^vA


// First robot presses numerical keys
// Second robot controls first robot's arm
// Third robot presses second robot's arm


function complexity(code) {
    // Get all possible numpad for first robot.
    let first = numericPad(code)

    console.log('first', first)
    
    // Get all possible dirpad for second robot.
    let second = first.map(seq => dirPad(seq))
    let best = 100000000000000000000

    // Find shortest sequence.
    for (let s of second) {
        if (s[0].length < best) {
            best = s[0].length
        }
    }

    // Gather all shortest sequences.
    let bestSecond = []
    for (let s of second) {
        for (let si of s) {
            if (si.length == best) {
                bestSecond.push(si)
            }            
        }
    }

    console.log('second', bestSecond)

    // // Get one possible dirpad for third robot.
    // let third = bestSecond.map(seq => oneDirPad(seq))
    // best = 100000000000000000000

    // // Find shortest sequence.
    // for (let t of third) {
    //     if (t.length < best) {
    //         best = t.length
    //     }
    // }

    // return best

    let third = bestSecond.map(seq => dirPad(seq))
    best = 100000000000000000000

    // Find shortest sequence.
    for (let t of third) {
        if (t[0].length < best) {
            best = t[0].length
        }
    }

    // Gather all shortest sequences.
    let bestThird = []
    for (let t of third) {
        for (let ti of t) {
            if (ti.length == best) {
                bestThird.push(ti)
            }            
        }
    }

    console.log('third', bestThird)

    return bestThird[0].length
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

function partB(info) {
    let sum = 0
    return sum
}

// console.log(partA(test))
console.log(partA(input))
// console.log('--')
// console.log(partB(test))
// console.log(partB(input))
