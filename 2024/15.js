const fs = require('fs');
const u = require('./util2')
let Grid = u.Grid

let small = fs.readFileSync('./small15.txt', {encoding:'utf8', flag:'r'});
let test = fs.readFileSync('./test15.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input15.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    let l = lines.split('\n\n')
    let big = l[0].replaceAll('#', '##').replaceAll('O', '[]').replaceAll('.', '..').replaceAll('@', '@.')
    return {map: new Grid(l[0]), bigMap: new Grid(big), moves: l[1].replaceAll('\n', '').split('')}
}

small = parse(small)
test = parse(test)
input = parse(input)

let delta = {
    '>': [0, 1],
    '<': [0, -1],
    '^': [-1, 0],
    'v': [1, 0]
}

function add(v1, v2) {
    return [v1[0] + v2[0], v1[1]+v2[1]]
}

function doMove(map, cur, dir) {
    let d = delta[dir]

    let next = add(cur, d) 
    if (map.getAt(next) == 'O') {
        doMove(map, next, dir)
    }

    if (map.getAt(next) == '.') {
        map.setAt(next, map.getAt(cur))
        map.setAt(cur, '.')
    } 
}

function canBigMove(map, cur, dir) {
    let d = delta[dir]

    let next = add(cur, d) 
    if (map.getAt(next) == '[') {
        if (dir == '^' || dir == 'v') {
            return canBigMove(map, next, dir) && canBigMove(map, add(next, [0, 1]), dir)
        }
        if (dir == '>') {
            return canBigMove(map, add(next, [0, 1]), dir)
        }
    } else if (map.getAt(next) == ']') {
        if (dir == '^' || dir == 'v') {
            return canBigMove(map, next, dir) && canBigMove(map, add(next, [0, -1]), dir)
        }
        if (dir == '<') {
            return canBigMove(map, add(next, [0, -1]), dir)
        }
    } else if (map.getAt(next) == '.') {
        return true
    } else if (map.getAt(next) == '#') {
        return false
    } 
}

function doBigMove(map, cur, dir) {
    let d = delta[dir]

    let next = add(cur, d) 
    if (map.getAt(next) == '[') {
        if (dir == '^' || dir == 'v') {
            doBigMove(map, next, dir)
            doBigMove(map, add(next, [0, 1]), dir)
        }
        if (dir == '>') {
            doBigMove(map, add(next, [0, 1]), dir)
            doBigMove(map, next, dir)
        }
    } else if (map.getAt(next) == ']') {
        if (dir == '^' || dir == 'v') {
            doBigMove(map, next, dir)
            doBigMove(map, add(next, [0, -1]), dir)
        }
        if (dir == '<') {
            doBigMove(map, add(next, [0, -1]), dir)
            doBigMove(map, next, dir)
        }
    }

    if (map.getAt(next) == '.') {
        map.setAt(next, map.getAt(cur))
        map.setAt(cur, '.')
    }
}

function partA(info) {
    let {map, moves} = info
    let cur = map.find('@')
    for (let m of moves) {
        // console.log('moving', m)
        doMove(map, cur, m)
        // map.print()
        cur = map.find('@')
    }

    map.print()

    let sum = 0
    for (let box of map.findAll('O')) {
        sum += 100 * box[0] + box[1]
    }
    return sum
}

function partB(info) {
    let {map, bigMap, moves} = info
    let cur = bigMap.find('@')

    bigMap.print()

    for (let m of moves) {
        console.log('moving', m)
        if (canBigMove(bigMap, cur, m)) {
            doBigMove(bigMap, cur, m)
        }
        // bigMap.print()
        cur = bigMap.find('@')
    }

    bigMap.print()

    let sum = 0
    for (let box of bigMap.findAll('[')) {
        sum += 100 * box[0] + box[1]
    }
    return sum
}

// console.log(partA(small))
// console.log(partA(test))
// console.log(partA(input))
// console.log('--')
// console.log(partB(small))
// console.log(partB(test))
console.log(partB(input))
