const fs = require('fs');
const u = require('./util2')
let Grid = u.Grid

let test = fs.readFileSync('./test20.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input20.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    lines = new Grid( lines.split('\n').map(x => x.split('')) )
    return lines
}

test = parse(test)
input = parse(input)

// test.print()
// console.log()


function dijkstra(grid, start) {
    let q = []
    let dist = grid.copyEmpty(Number.MAX_SAFE_INTEGER)

    dist.setAt(start, 0)

    let debug = false

    q.push(start)

    while (q.length) {
        let u = q.shift()

        if (debug) console.log('queue is', q)
        if (debug) console.log('min position is', u)

        for (let next of grid.neighbors(u)) {
            if (debug)  console.log('trying n=', next)
            if (grid.getAt(next) != '#') {
                let alt = dist.getAt(u) + 1
                if (alt < dist.getAt(next)) {
                    dist.setAt(next, alt)
                    q.push(next)
                }
            }
        }

        if (debug)  console.log(dist)
    }
    return dist
}

function isOnPath(dist, end, pos) {
    let cur = end

    while (dist.getAt(cur) != 0) {
        if (cur[0] == pos[0] && cur[1] == pos[1]) return true

        let found = false
        for (let n of dist.neighbors(cur)) {
            if (dist.getAt(n) == dist.getAt(cur)-1) {
                cur = n
                found = true
            }
        }
        if (!found) return false
    }

    if (cur[0] == pos[0] && cur[1] == pos[1]) return true
    return false
}


function partAA(grid) {
    let startTime = new Date()

    let start = grid.find('S')
    let end = grid.find('E')

    let dist = dijkstra(grid, start)
    let orig = dist.getAt(end)

    let results = []

    for (let wall of grid.findAll('#')) {
        grid.setAt(wall, '1')
        // grid.setAt(next, '2')

        dist = dijkstra(grid, start)

        let newDist = dist.getAt(end)

        let first = grid.find('1')
        // let second = grid.find('2')

        // Make sure that the distance is shorter, and 1 and 2 are both on the path.
        if (newDist < orig
            // && dist.getAt(first) < dist.getAt(second)
   //         && isOnPath(dist, end, first)  
            // && isOnPath(dist, end, second)
            )
        {
            results.push({wall, /* next,*/ newDist})
        }

        grid.setAt(wall, '#')
    }

    results.sort((a,b) => a.newDist - b.newDist)

    let sum = 0

    for (let i=0; i < results.length && orig - results[i].newDist >= 100; i++) {
//        console.log(orig - results[i].newDist)
        sum++
    }

    console.log('time:',  '' + (new Date() - startTime) + 'ms')

    return sum
}

function partA(grid) {
    let start = grid.find('S')
    let end = grid.find('E')

    let dist = dijkstra(grid, start)
    let orig = dist.getAt(end)

    let results = []

    for (let wall of grid.findAll('#')) {
        let neighborScores = []
        for (let next of grid.neighbors(wall)) {
            if (grid.getAt(next) != '#' && isOnPath(dist, end, next)) {
                neighborScores.push(dist.getAt(next))
            }
        }
        if (neighborScores.length >= 2) {
            neighborScores.nsort()
            let saved = neighborScores[neighborScores.length-1] - (neighborScores[0]+2)
            if (saved > 0) {
                results.push({wall, saved})

                if (saved == 4) {
                    // grid.setAt(wall, '1')
                    // grid.print()
                    // grid.setAt(wall, '#')
                    // console.log('saved', saved)
                    // console.log('--')
                }
            }
        }
    }

    results.sort((a,b) => b.saved - a.saved)

    let sum = 0

    for (let i=0; i < results.length && results[i].saved >= 100; i++) {
        console.log(results[i].saved)
        sum++
    }
    return sum
}

function partB(grid) {
    let start = grid.find('S')
    let end = grid.find('E')

    let dist = dijkstra(grid, start)
    let orig = dist.getAt(end)

    let results = []

    for (let pos1 of grid.indexes()) {
        // console.log('checking', pos1)
        for (let i=pos1[0]-20; i<=pos1[0]+20; i++) {
            for (let j=pos1[1]-20; j<=pos1[1]+20; j++) {
                let pos2 = [i, j]
                let manhattan = Math.abs(pos2[0]-pos1[0]) + Math.abs(pos2[1]-pos1[1])
                if (manhattan <= 20 && grid.getAt(pos1) != '#' && grid.getAt(pos2) != '#') {
                    let saved = dist.getAt(pos2) - (dist.getAt(pos1) + manhattan)
                    if (saved > 0) {
                        results.push({pos1, pos2, saved})
                    }
                }
            }
        }
    }

    let sum = 0

    let count = new Map()

    for (let r of results) {
        if (r.saved >= 100) {
            count.set(r.saved, count.has(r.saved) ? count.get(r.saved)+1 : 1)
            sum++
        }
    }

    let keys = [...count.keys()]
    keys.nsort()

    // console.log(count)

    return sum
}

// console.log(partAA(test))
// console.log(partA(test))
console.log(partAA(input))
// console.log(partA(input))
// console.log('--')
// console.log(partB(test))
// console.log(partB(input))
