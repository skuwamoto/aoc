const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test8.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input8.txt', {encoding:'utf8', flag:'r'});

test = parse(test)
input = parse(input)

console.log(test)

function parse(lines) {
    return lines
}

function count(g, n) {
    let count = 0
    for ([i, j, v] of g.indexesAndValues()) {
        if (v == n) count++
    }
    return count
}

function partA(lines, w, h) {
    let layers = []
    let idx = 0

    while (idx <= lines.length - (h*w-1)) {
        let g = u.newGrid(h, w)
        layers.push(g)

        for (i=0; i < h; i++) {
            for (j=0; j < w; j++) {
                g[i][j] = Number(lines[idx++])
            }
        }
    }

    let best = null
    let numZero = 10000000000

    for (l of layers) {
        thisNZ = count(l, 0)
        if (thisNZ < numZero) {
            numZero = thisNZ
            best = l
        }
    }

    return count(best, 1) * count(best, 2)
}

function partB(lines, w, h) {
    let layers = []
    let idx = 0

    while (idx <= lines.length - (h*w-1)) {
        let g = u.newGrid(h, w)
        layers.push(g)

        for (i=0; i < h; i++) {
            for (j=0; j < w; j++) {
                g[i][j] = Number(lines[idx++])
            }
        }
        g.print()
    }

    let result = layers[0].copy()

    for (l of layers) {
        for (i=0; i < h; i++) {
            for (j=0; j < w; j++) {
                if (result[i][j] == 2) {
                    result[i][j] = l[i][j]
                }
            }
        }
    }
    result.print()
}

// console.log(partA(test, 3, 2))
// console.log(partA(input, 25, 6))
// console.log('--')
// console.log(partB(test, 2, 2))
console.log(partB(input, 25, 6))

