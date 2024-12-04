const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test14.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input14.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    return lines.split('\n').map(x => x.split(''))
}

test = parse(test)
input = parse(input)

test.print()

function moveNorth(g, i, j) {
    for (let ii = i-1; ii >= 0; ii--) {
        if (g[ii][j] == '.') {
            g[ii][j] = 'O'
            g[ii+1][j] = '.'
        } else {
            return
        }
    }
}

let delta = [[-1, 0], [0, -1], [1, 0], [0, 1]]

function moveInDir(g, i, j, d) {
    let dd = delta[d]
    i += dd[0]
    j += dd[1]

    while (i >= 0 && i < g.h() && j >= 0 && j < g.w()) {
        if (g[i][j] == '.') {
            g[i][j] = 'O'
            g[i-dd[0]][j-dd[1]] = '.'
        } else {
            return
        }
        i += dd[0]
        j += dd[1]
    }
}

function partA(g) {
    let sum = 0

    for (let i=0; i < g.h(); i++) {
        for (let j=0; j < g.w(); j++) {
            if (g[i][j] == 'O') {
                moveNorth(g, i, j)
            }
        }
    }

    g.print()

    for (let i=0; i < g.h(); i++) {
        for (let j=0; j < g.w(); j++) {
            if (g[i][j] == 'O') {
                sum += g.h() - i
            }
        }
    }    

    return sum
}

function calcScore(g) {
    let sum = 0
    for (let i=0; i < g.h(); i++) {
        for (let j=0; j < g.w(); j++) {
            if (g[i][j] == 'O') {
                sum += g.h() - i
            }
        }
    }    
    return sum
}

function partB(g) {
    let next = {}
    let firstKey = null
    let firstKK = 0
    for (let kk = 0; kk < 1000000000; kk++) {

        let key = g.gridToString()

        if (next[key]) {
            g = next[key]
            if (!firstKey) {
                firstKey = key
                firstKK = kk
            } else if (key == firstKey) {
                let repeat = kk-firstKK
                console.log('key found at', kk)
                kk += Math.floor((1000000000-kk) / repeat) * repeat
                console.log('advanced to', kk)
            }
        } else {
            for (let i=0; i < g.h(); i++) {
                for (let j=0; j < g.w(); j++) {
                    if (g[i][j] == 'O') {
                        moveInDir(g, i, j, 0)
                    }
                }
            }

            for (let j=0; j < g.w(); j++) {
                for (let i=0; i < g.h(); i++) {
                    if (g[i][j] == 'O') {
                        moveInDir(g, i, j, 1)
                    }
                }
            }

            for (let i=g.h()-1; i >= 0; i--) {
                for (let j=0; j < g.w(); j++) {
                    if (g[i][j] == 'O') {
                        moveInDir(g, i, j, 2)
                    }
                }
            }

            for (let j=g.w(); j >= 0; j--) {
                for (let i=0; i < g.h(); i++) {
                    if (g[i][j] == 'O') {
                        moveInDir(g, i, j, 3)
                    }
                }
            }
            next[key] = g.copy()
        }
        // if ((1000000000-kk) % 10000 == 0) console.log(kk, calcScore(g))
    }

    return calcScore(g)
}

// console.log(partA(test))
// console.log(partA(input))
// console.log('--')
// console.log(partB(test))
console.log(partB(input))
