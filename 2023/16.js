const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test16.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input16.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    return lines.stringToGrid()
}

test = parse(test)
input = parse(input)

test.print()

let dir = {
    E: [0, 1],
    W: [0, -1],
    N: [-1, 0],
    S: [1, 0]
}

let same = {
    E: '-',
    W: '-',
    N: '|',
    S: '|'
}

function step(beams, g, visited, cache) {
    // visited.print()
    // console.log(beams)
    // console.log()
    // console.log()

    let moreBeams = []
    for (b of beams) {
        let [i, j, d] = b
        let dd = null
        i += dir[d][0]
        j += dir[d][1]

        if (i >= 0 && j >= 0 && i < g.h() && j < g.w()) {
            if (g[i][j] == '.' || g[i][j] == same[d]) {
                // do nothing
            } else if (g[i][j] == '/') {
                if (d == 'E') d = 'N'
                else if (d == 'N') d = 'E'
                else if (d == 'S') d = 'W'
                else if (d == 'W') d = 'S'
            } else if (g[i][j] == '\\') {
                if (d == 'E') d = 'S'
                else if (d == 'S') d = 'E'
                else if (d == 'N') d = 'W'
                else if (d == 'W') d = 'N'
            } else {
                if (d == 'E' || d == 'W') {
                    d = 'N'
                    dd = 'S'
                }
                else {
                    d = 'E'
                    dd = 'W'
                }
            }

            b[0] = i
            b[1] = j
            b[2] = d
            visited[i][j] = '#'

            if (cache[b.join(':')]) {
                b[2] = null
            } else {
                cache[b.join(':')] = true
            }
        
            if (dd) moreBeams.push([i, j, dd])
        } else {
            b[2] = null
        }
    }

    for (let i = beams.length-1; i >= 0; i--) {
        if (beams[i][2] == null) {
            beams.splice(i, 1)
        }
    }

    beams.push(...moreBeams)
}

function partA(g, i, j, d) {
    let cache = {}

    let beams = [[i, j, d]]
    let visited = g.copyEmpty()

    let count = 0

    let lastVisited = visited.gridToString()

    while (beams.length) {
        step(beams, g, visited, cache)
        let v = visited.gridToString()
        if (v == lastVisited) count++ 
        else count = 0

        lastVisited = v

        if (count >= 200) break
    }

    let sum = 0
    for ([i, j, v] of visited.indexes()) {
        if (v) sum++
    }
    return sum
}

function partB(g) {
    let best = 0

    for (i=0; i < g.h(); i++) {
        best = Math.max(best, partA(g, i, -1, 'E'))
        best = Math.max(best, partA(g, i, g.w(), 'W'))
    }

    for (j=0; j < g.w(); j++) {
        best = Math.max(best, partA(g, -1, j, 'S'))
        best = Math.max(best, partA(g, g.h(), j, 'N'))
    }

    return best
}

console.log(partA(test, 0, -1, 'E'))
console.log(partA(input, 0, -1, 'E'))
// console.log('--')
console.log(partB(test))
console.log(partB(input))
