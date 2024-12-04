const fs = require('fs');
const u = require('./util')
const ic = require('./intcode')

let input = fs.readFileSync('./input13.txt', {encoding:'utf8', flag:'r'});

input = parse(input)

function parse(lines) {
    return lines.split(',').map(Number)
}

function partA(code) {
    let m = new ic.Machine('machine', code)

    let output = []
    while (true) {
        out = m.run()

        if (out.opName == 'END') break
        if (out.opName == 'OUTPUT') {
            output.push(out.result)
        }
    }

    let count = 0
    let maxX = 0
    let maxY = 0
    while (output.length > 0) {
        let a = output.shift()
        let b = output.shift()
        let c = output.shift()
        if (c == 2) count++
        if (a > maxX) maxX = a
        if (b > maxY) maxY = b
    }

    return [count, maxX, maxY]
}

let icon = [' ', '#', '*', '-', 'o']

function partB(code) {
    let board = u.newGrid(24, 24)

    code[0] = 2

    let m = new ic.Machine('machine', code)

    let output = []

    let ball = -1
    let paddle = -1
    let score = -1

    while (true) {
        out = m.run()
        if (out.opName == 'END') {
            console.clear()
            console.log('score:', score)
            u.print(board)
            break
        }
        if (out.opName == 'OUTPUT') {
            output.push(out.result)
        }
        if (out.opName == 'INPUT') {
            let x=1
            for (i=0; i< 100000; i++) { x = x+1}

            if (ball < paddle) {
                m.addInput(-1)
            } else if (ball > paddle) {
                m.addInput(1)
            } else {
                m.addInput(0)
            }

            console.clear()
            console.log('score:', score)
            u.print(board)
        }
        if (output.length == 3) {
            let [a,b,c] = output
            output = []

            if (a == -1) {
                score = c
            } else {
                board.setAt(b,a,icon[c])
                if (c == 3) {
                    paddle = a
                }
                if (c == 4) {
                    ball = a
                }
            }
        }
    }
    return score
}


console.log(partA(input))
console.log('--')
console.log(partB(input))

