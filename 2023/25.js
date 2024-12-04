const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test25.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input25.txt', {encoding:'utf8', flag:'r'});

function addToMap(map, key, val) {
    if (map[key]) {
        map[key].add(val) 
    } else {
        map[key] = new Set([val])
    }
}

function makeKey(s1, s2) {
    return (s1 < s2) ? s1+':'+s2 : s2+':'+s1
}

function printMap(map) {
    let keys = Object.keys(map)
    keys.sort()
    for (let key of keys) {
        let row = []
        row.push(...map[key].values())
        row.sort()
        console.log(key + ':', JSON.stringify(row))
    }
}

function parse(lines) {
    lines = lines.split('\n').map(x => ({from: x.before(': '), to: x.after(': ').split(' ')}))
    let result = {}
    for (let {from, to} of lines) {
        for (let tt of to) {
            addToMap(result, from, tt)
            addToMap(result, tt, from)
        }
    }
    return result
}

test = parse(test)
input = parse(input)

function findShortestPath(graph, node, sameSideMap, blocked) {
    let queue = []
    queue.push([node])

    while (queue.length > 0) {
        let curPath = queue.shift()
        let curNode = curPath[curPath.length-1]
        for (let next of graph[curNode]) {
            if (!blocked.has(makeKey(curNode, next))) {
                if (sameSideMap.get(next) == true) {
                    curPath.push(next)
                    return curPath             
                } else {
                    if (!curPath.includes(next)) {
                        nextPath = curPath.concat([next])
                        queue.push(nextPath)
                    }
                }
            }
        }
    }
    return null
}

function canReach(graph, node, sameSideMap, blocked) {
    let queue = []
    queue.push(node)

    let visited = new Set()
    visited.add(node)

    while (queue.length > 0) {
        let curNode = queue.shift()
        visited.add(curNode)
        for (let next of graph[curNode]) {
            if (!blocked.has(makeKey(curNode, next))) {
                if (sameSideMap.get(next) == true) return true
                if (!visited.has(next)) {
                    queue.push(next)
                }
            }
        }
    }
    return false
}

function findSide(graph, node, sameSideMap) {
    let blocked = new Set()
    for (let k=0; k <= 3; k++) {
        if (!canReach(graph, node, sameSideMap, blocked)) return false

        let path = findShortestPath(graph, node, sameSideMap, blocked)
        for (let p=0; p < path.length-1; p++) {
            blocked.add(makeKey(path[p], path[p+1]))
        }
    }
    return true
}

function getSameSideMap(graph) {
    let nodes = Object.keys(graph)

    let sameSideMap = new Map()
    sameSideMap.set(nodes[0], true)

    let queue = [nodes[0]]

    while (queue.length > 0) {
        let cur = queue.shift()
        for (let next of graph[cur]) {
            if (!sameSideMap.has(next)) {
                let side = findSide(graph, next, sameSideMap)
                sameSideMap.set(next, side)
                queue.push(next)
            }
        }
    }

    return sameSideMap
}

function partA(graph) {
    let sameSideMap = getSameSideMap(graph)
    let leftCount = 0
    let rightCount = 0

    for (let key of sameSideMap.keys()) {
        if (sameSideMap.get(key) == true) {
            leftCount++
        } else {
            rightCount++
        }
    }

    return leftCount * rightCount
}

function partB(graph) {
    let sum = 0
    return sum
}

// console.log(partA(test))
console.log(partA(input))
// console.log('--')
// console.log(partB(test))
// console.log(partB(input))
