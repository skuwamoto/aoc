const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test23.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input23.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    return lines.stringToGrid()
}

test = parse(test)
input = parse(input)

test.print()

function key(i, j) {
    return '(' + i+','+j+')'
}

function keyToPos(key) {
    return key.between('(', ')').split(',').map(Number)
}

function keyToNodes(key) {
    return key.between('(', ')').split(',')
}

function partA(g) {
    let path = key(0, 1)

    let q = [[0, 1, path]]

    let success = []

    while (q.length) {
        let [i, j, path] = q.shift()
        if (i == g.h()-1 && j == g.w()-2) {
            success.push(path)
        } else {
            let neighbors
            if (g[i][j] == '>')      neighbors = [[i, j+1]]
            else if (g[i][j] == '<') neighbors = [[i, j-1]]
            else if (g[i][j] == 'v') neighbors = [[i+1, j]]
            else if (g[i][j] == '^') neighbors = [[i-1, j]]
            else neighbors = g.neighbors(i, j, false)

            for (let [ii, jj] of neighbors) {
                if (!path.includes(key(ii, jj))) {
                    if (g[ii][jj] != '#') {
                        q.push([ii, jj, path + key(ii, jj)])
                        // console.log(q[q.length-1])
                    } else {
                        // console.log("not adding", ii, jj, 'because #')
                    }
                } else {
                    // console.log("not adding", ii, jj, 'because previously visited')
                }
            }
        }
    }

    success.sort((a, b) => b.length - a.length)

    return success[0].split(',').length - 2
}

function partB(g) {
    let path = key(0, 1)

    let q = [[0, 1, path]]

    let success = []

    let count = 0
    while (q.length) {
        let [i, j, path] = q.pop()
        if (i == g.h()-1 && j == g.w()-2) {
            success.push(path)
        } else {
            let neighbors = g.neighbors(i, j, false)

            for (let [ii, jj] of neighbors) {
                if (!path.includes(key(ii, jj))) {
                    if (g[ii][jj] != '#') {
                        q.push([ii, jj, path + key(ii, jj)])
                        // console.log(q[q.length-1])
                    } else {
                        // console.log("not adding", ii, jj, 'because #')
                    }
                } else {
                    // console.log("not adding", ii, jj, 'because previously visited')
                }
            }
        }
        count++
        if (count % 10000 == 0) {
            console.log(count, 'queue:', q.length, 'cur path', q[q.length-1][2].length, 'success', success.length)
        }
    }

    success.sort((a, b) => b.length - a.length)

    return success[0].split(',').length - 2
}

function partB(g) {
    let path = key(0, 1)

    let q = [[0, 1, path]]

    let success = []

    let count = 0
    while (q.length) {
        let [i, j, path] = q.pop()
        if (i == g.h()-1 && j == g.w()-2) {
            success.push(path)
        } else {
            let neighbors = g.neighbors(i, j, false)

            for (let [ii, jj] of neighbors) {
                if (!path.includes(key(ii, jj))) {
                    if (g[ii][jj] != '#') {
                        q.push([ii, jj, path + key(ii, jj)])
                        // console.log(q[q.length-1])
                    } else {
                        // console.log("not adding", ii, jj, 'because #')
                    }
                } else {
                    // console.log("not adding", ii, jj, 'because previously visited')
                }
            }
        }
        count++
        if (count % 10000 == 0) {
            console.log(count, 'queue:', q.length, 'cur path', q[q.length-1][2].length, 'success', success.length)
        }
    }

    success.sort((a, b) => b.length - a.length)

    return success[0].split(',').length - 2
}

let keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

function markNodes(g) {
    let nodes = {}
    let nodeCount = 0

    nodes['A'] = [0, 1]

    for (let [i, j] of g.indexes()) {
        if (g[i][j] != '#') {
            let count = 0
            for (let [ii, jj] of g.neighbors(i, j, false)) {
                if (g[ii][jj] != '#') count++
            }
            if (count > 2) {
                nodeCount++
                nodes[keys[nodeCount]] = [i, j]
            }
        }
    }

    nodes['z'] = [g.h()-1, g.w()-2]

    console.log(nodes)

    return nodes
}

function getIsNodeMap(nodes) {
    let isNodeMap = {}
    for (let n in nodes) {
        isNodeMap[key(...nodes[n])] = n
    }
    return isNodeMap
}

function getDist(g, i, j, isNodeMap, visited, startingDist=1) {
    if (isNodeMap[key(i, j)]) {
        return [isNodeMap[key(i, j)], startingDist]
    }
    else {
        for (let [ii, jj] of g.neighbors(i, j, false)) {
            if (g[ii][jj] != '#' && !visited.includes(key(ii, jj))) {
                return getDist(g, ii, jj, isNodeMap, visited + key(i,j), startingDist+1)
            }
        }
    }
    throw new Error('shouldnt get here')
}

function partBB(g) {
    let nodes = markNodes(g)
    let isNodeMap = getIsNodeMap(nodes)
    let dists = {}

    for (let n in nodes) {
        let [i, j] = nodes[n]
        let visited = key(i, j)

        dists[n] = []
        for (let [ii, jj] of g.neighbors(i, j, false)) {
            if (g[ii][jj] != '#') {
                [nextNode, dist] = getDist(g, ii, jj, isNodeMap, visited)
                dists[n].push([nextNode, dist])
                if (n.charCodeAt(0) < nextNode.charCodeAt(0)) {
                    console.log('dist from', n, 'to', nextNode, 'is', dist)
                }
            }
        }
    }

    /////////

    let path = 'A'

    let q = [['A', path, 0]]

    let success = []

    let count = 0
    while (q.length) {
        let [node, path, distSoFar] = q.pop()
        if (node == 'z') {
            success.push([path, distSoFar])
        } else {
            for (let [nextNode, dist] of dists[node]) {
                if (!path.includes(nextNode)) {
                    q.push([nextNode, path + nextNode, distSoFar + dist])
                    // console.log(q[q.length-1])
                } else {
                    // console.log("not adding", nextNode, 'because previously visited')
                }
            }
        }
        count++
        if (count % 10000 == 0) {
            // console.log(count, 'queue:', q.length, 'cur path', q[q.length-1][2].length, 'success', success.length)
            console.log(q.length)
        }
    }

    success.sort((a, b) => b[1] - a[1])

    return success[0][1]
}

// console.log(partA(test))
// console.log(partA(input))
// console.log('--')
// console.log(partB(test))
// console.log(partB(input))


// console.log(partBB(test))
console.log(partBB(input))
