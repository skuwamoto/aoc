const fs = require('fs');
const u = require('./util')
const ic = require('./intcode')

let test = fs.readFileSync('./test11.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input11.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    return lines.split(',').map(Number)
}

let deltas = [
    [-1, 0], // u
    [0, 1],  // r
    [1, 0],  // d
    [0, -1]  // l
]
function partA(code) {
    let m = new ic.Machine('machine', code)
    let g = u.newGrid(150, 150, '-')

    let [i, j] = [75, 75]
    let dir = 0
    let out

    while (true) {
        m.addInput(g[i][j] == '-'  ? 0 : g[i][j])

        // Paint
        out = m.run()

        if (out.opName == 'END') break
        if (out.opName == 'OUTPUT') {
            g[i][j] = out.result
        }

        // Turn and move forward
        out = m.run()

        if (out.opName == 'END') break
        if (out.opName == 'OUTPUT') {
            if (out.result == 0) dir = (dir+3) % 4
            if (out.result == 1) dir = (dir+1) % 4
            i += deltas[dir][0]
            j += deltas[dir][1]
        }
    }

    g.print()

    let sum = 0
    for ([ii, jj, v] of g.indexesAndValues()) {
        if (v !== '-') sum++
    }
    return sum
}

function partB(code) {
    let m = new ic.Machine('machine', code)
    m.addInput(2)
    console.log(m.run())
    m.disassemble()
}

// console.log(partA(parse(test)))
console.log(partA(parse(input)))
// console.log('--')
// console.log(partB(parse(test)))
// console.log(partB(parse(input)))

