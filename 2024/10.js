const fs = require('fs');
const u = require('./util2')
let Grid = u.Grid

let test = fs.readFileSync('./test10.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input10.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    return new Grid( 
        lines.split('\n').map(x => x.split('').map(Number))
    )
}

test = parse(test)
input = parse(input)

// test.print()
// console.log()

// test = test.stringToGrid()
// input = input.stringToGrid()

// test.print()

function markReached(info, i, j, cur, map) {
    let sum = 0
    if (cur == 9) {
        map.setAt(i, j, 1)
        sum = 1
    } else {
        for (let [ii, jj] of info.neighbors(i, j, false)) {
            if (info.getAt(ii, jj) == cur+1 && !map.getAt(ii, jj)) {
                sum += markReached(info, ii, jj, cur+1, map)
            }
        }
    }
    return sum
}

function partA(info) {
    let sum = 0

    for (let [i, j] of info.findAll(0)) {
        let map = info.copyEmpty()
        let num = markReached(info, i, j, 0, map)
        sum += num
    }

    return sum
}

function partB(info) {
    let sum = 0
    return sum
}

// console.log(partA(test))
console.log(partA(input))
// console.log('--')
// console.log(partB(test))
// console.log(partB(input))
