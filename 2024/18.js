const fs = require('fs');
const u = require('./util2')
let Grid = u.Grid

let test = fs.readFileSync('./test18.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input18.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    lines = lines.split('\n').map(x => x.split(',').map(Number)) 
    return lines
}

test = parse(test)
input = parse(input)

function dijkstra(grid, start) {
    let q = []
    let dist = grid.copyEmpty()

    for (k of grid.indexes()) {
        dist.setAt(k, Number.MAX_SAFE_INTEGER)
        q.push(k)
    }
    dist.setAt(start, 0)

    let debug = false

    while (q.length) {
        let minIndex = q.minIndex((a, b) => dist.getAt(a)-dist.getAt(b))
        let u = q[minIndex]
        q.splice(minIndex, 1)

        if (debug) console.log('queue is', q)
        if (debug) console.log('min position is', u)

        for (let next of grid.neighbors(u)) {
            if (q.find((x) => next[0] == x[0] && next[1] == x[1])) {
                if (debug)  console.log('trying n=', next)
                if (grid.getAt(next) != '#') {
                    let alt = dist.getAt(u) + 1
                    if (alt < dist.getAt(next)) {
                        dist.setAt(next, alt)
                    }
                }
            }
        }

        if (debug)  console.log(dist)
    }
    return dist
}

function partA(info, h, w, steps) {
    let grid = new Grid(h, w)
    grid.print()

    for (let i=0; i < steps; i++) {
        grid.setAt(info[i][1], info[i][0], '#')
    }

    grid.print()
    let dist = dijkstra(grid, [0,0])

    return dist.getAt(h-1, w-1)
}

function partB(info, h, w) {
    let grid = new Grid(h, w)

    let startChecking = 2930

    for (let i=0; i < info.length; i++) {
        console.log(i)
        grid.setAt(info[i][1], info[i][0], '#')
        if (i > startChecking) {
            let dist = dijkstra(grid, [0,0])
            if (dist.getAt(h-1, w-1) == Number.MAX_SAFE_INTEGER) {
                return info[i].join(',')
            }
        }
    }
}

// console.log(partA(test, 7, 7, 12))
// console.log(partA(input, 71, 71, 1024))
// console.log('--')
console.log(partB(test, 7, 7, 12))
console.log(partB(input, 71, 71, 1024))
