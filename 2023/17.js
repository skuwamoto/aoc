const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test17.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input17.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    return lines.stringToGrid().mapGrid(Number)
}

test = parse(test)
input = parse(input)

const Inf = 10000000000

function partB(g) {
    let minPath = 4
    let maxPath = 10

    let unvisited = []
    let done = new Set()

    // Each node in our graph is a configuration [i, j, dir, nTimes]
    // For each configuration, we want to track the lowest distance
    // using dijkstra's algorithm.

    // Start at top left (direction is arbitrary)
    let cur = [0, 0, '>', 0, 0, '']

    done.add(cur.slice(0, 4).join(','))

    let best = Inf
    let bestPath = ''

    let count = 0

    while (cur) {
        // Find all neighbors of the current and mark distances.
        // console.log(cur)
        let [i, j, d, n, sum, path] = cur

        if (i == g.h()-1 && j == g.w()-1) {
            if (cur[4] < best && cur[3] >= minPath) {
                best = cur[4]
                bestPath = cur[5]
            }
        }

        if (i > 0) {
            if ((d == '^' && n < maxPath) || ((d == '<' || d == '>') && n >= minPath)) {
                next = [i-1, j, '^', d == '^' ? n+1 : 1, sum+g[i-1][j], path+'^']
                prev = unvisited.find(x => x[0] == next[0] && x[1] == next[1] && x[2] == next[2] && x[3] == next[3])
                if (prev) {
                    if (prev[4] > next[4]) {
                        prev[4] = next[4]
                        prev[5] = next[5]
                    }
                } else {
                    if (!done.has(next.slice(0, 4).join(','))) {
                        unvisited.push(next)
                    }
                }
            }
        } 
        if (i < g.h()-1) {
            if ((d == 'v' && n < maxPath) || ((d == '<' || d == '>') && n >= minPath)) {
                next = [i+1, j, 'v', d == 'v' ? n+1 : 1, sum+g[i+1][j], path+'v']
                prev = unvisited.find(x => x[0] == next[0] && x[1] == next[1] && x[2] == next[2] && x[3] == next[3])
                if (prev) {
                    if (prev[4] > next[4]) {
                        prev[4] = next[4]
                        prev[5] = next[5]
                    }
                } else {
                    if (!done.has(next.slice(0, 4).join(','))) {
                        unvisited.push(next)
                    }
                }
            }
        }

        if (j > 0) {
            if ((d == '<' && n < maxPath) || ((d == '^' || d == 'v') && n >= minPath)) {
                next = [i, j-1, '<', d == '<' ? n+1 : 1, sum+g[i][j-1], path+'<']
                prev = unvisited.find(x => x[0] == next[0] && x[1] == next[1] && x[2] == next[2] && x[3] == next[3])
                if (prev) {
                    if (prev[4] > next[4]) {
                        prev[4] = next[4]
                        prev[5] = next[5]
                    }
                } else {
                    if (!done.has(next.slice(0, 4).join(','))) {
                        unvisited.push(next)
                    }
                }
            }
        } 
        if (j < g.w()-1) {
            if ((d == '>' && n < maxPath) || ((d == '^' || d == 'v') && n >= minPath)) {
                next = [i, j+1, '>', d == '>' ? n+1 : 1, sum+g[i][j+1], path+'>']
                prev = unvisited.find(x => x[0] == next[0] && x[1] == next[1] && x[2] == next[2] && x[3] == next[3])
                if (prev) {
                    if (prev[4] > next[4]) {
                        prev[4] = next[4]
                        prev[5] = next[5]
                    }
                } else {
                    if (!done.has(next.slice(0, 4).join(','))) {
                        unvisited.push(next)
                    }
                }
            }
        }

        // Get the next current by finding the lowest distance.
        let lowest = Inf
        let lowestK = -1
        for (let k=0; k < unvisited.length; k++) {
            if (unvisited[k][4] < lowest) {
                lowest = unvisited[k][4]
                lowestK = k
            }
        }

        // Only unreachable nodes left!
        if (lowestK == -1) {
            break
        }

        // Pull it out of the array
        cur = unvisited[lowestK]
        unvisited.splice(lowestK, 1)
        done.add(cur.slice(0, 4).join(','))

        if (count++ % 1000 == 0) {
            console.log(unvisited.length)
        }
    }

    console.log(bestPath)
    return best
}

function key(state) {
    return [state.i, state.j, state.d, state.n].join(':')
}

function partBB(g, minN=4, maxN=10) {
    let unvisited = []
    let done = new Set()

    // Each node in our graph is a configuration [i, j, dir, nTimes]
    // For each configuration, we want to track the lowest distance
    // using dijkstra's algorithm.

    // Start at top left (direction is arbitrary)
    let cur = {
        i: 0, 
        j: 0, 
        d: 'v', 
        n: 0, 
        sum: 0, 
        path: ''
    }

    done.add(key(cur))

    let best = Inf
    let bestPath = ''

    let count = 0

    while (cur) {
        // Find all neighbors of the current and mark distances.
        // console.log(cur)
        let {i, j, d, n, sum, path} = cur

        if (i == g.h()-1 && j == g.w()-1) {
            if (sum < best && n >= minN) {
                best = sum
                bestPath = path
            }
        }

        if (i > 0) {
            if ((d == '^' && n < maxN) || ((d == '<' || d == '>') && n >= minN)) {
                next = {i: i-1, j, d: '^', n: d == '^' ? n+1 : 1, sum: sum+g[i-1][j], path: path+'^'}
                prev = unvisited.find(x => x.i == next.i && x.j == next.j && x.d == next.d && x.n == next.n)
                if (prev) {
                    if (prev.sum > next.sum) {
                        prev.sum = next.sum
                        prev.path = next.path
                    }
                } else {
                    if (!done.has(key(next))) {
                        unvisited.push(next)
                    }
                }
            }
        } 
        if (i < g.h()-1) {
            if ((d == 'v' && n < maxN) || ((d == '<' || d == '>') && n >= minN)) {
                next = {i: i+1, j, d: 'v', n: d == 'v' ? n+1 : 1, sum: sum+g[i+1][j], path: path+'v'}
                prev = unvisited.find(x => x.i == next.i && x.j == next.j && x.d == next.d && x.n == next.n)
                if (prev) {
                    if (prev.sum > next.sum) {
                        prev.sum = next.sum
                        prev.path = next.path
                    }
                } else {
                    if (!done.has(key(next))) {
                        unvisited.push(next)
                    }
                }
            }
        }

        if (j > 0) {
            if ((d == '<' && n < maxN) || ((d == '^' || d == 'v') && n >= minN)) {
                next = {i, j: j-1, d: '<', n: d == '<' ? n+1 : 1, sum: sum+g[i][j-1], path: path+'<'}
                prev = unvisited.find(x => x.i == next.i && x.j == next.j && x.d == next.d && x.n == next.n)
                if (prev) {
                    if (prev.sum > next.sum) {
                        prev.sum = next.sum
                        prev.path = next.path
                    }
                } else {
                    if (!done.has(key(next))) {
                        unvisited.push(next)
                    }
                }
            }
        } 
        if (j < g.w()-1) {
            if ((d == '>' && n < maxN) || ((d == '^' || d == 'v') && n >= minN)) {
                next = {i, j: j+1, d: '>', n: d == '>' ? n+1 : 1, sum: sum+g[i][j+1], path: path+'>'}
                prev = unvisited.find(x => x.i == next.i && x.j == next.j && x.d == next.d && x.n == next.n)
                if (prev) {
                    if (prev.sum > next.sum) {
                        prev.sum = next.sum
                        prev.path = next.path
                    }
                } else {
                    if (!done.has(key(next))) {
                        unvisited.push(next)
                    }
                }
            }
        }

        // Get the next current by finding the lowest distance.
        let lowest = Inf
        let lowestK = -1
        for (let k=0; k < unvisited.length; k++) {
            if (unvisited[k].sum < lowest) {
                lowest = unvisited[k].sum
                lowestK = k
            }
        }

        // Only unreachable nodes left!
        if (lowestK == -1) {
            break
        }

        // Pull it out of the array
        cur = unvisited[lowestK]
        unvisited.splice(lowestK, 1)
        done.add(key(cur))

        if (count++ % 1000 == 0) {
            console.log(unvisited.length)
        }
    }

    console.log(bestPath)
    return best
}


// console.log(partAA(test))
// console.log(partAA(input))
// console.log('--')
// console.log(partBB(test))
console.log(partBB(input))
