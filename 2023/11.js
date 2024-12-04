const fs = require('fs');
const u = require('./util')

let test = fs.readFileSync('./test11.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input11.txt', {encoding:'utf8', flag:'r'});

function parse(lines) {
    lines = lines.split('\n').map(x => x.split(''))
    return lines
}

test = parse(test)
input = parse(input)


test.print()
console.log()

function findExpandedPos(lines, space) {
    let emptyRows = new Set()
    let emptyCols = new Set()

    for (let i=0; i < lines.h(); i++) {
        found = false
        for (c of lines[i]) {
            if (c == '#') found = true
        }
        if (!found) {
            emptyRows.add(i)
        }
    }

    for (let j = 0; j < lines.w(); j++) {
        found = false
        for (i = 0; i < lines.h(); i++) {
            c = lines[i][j]
            if (c == '#') found = true
        }
        if (!found) {
            emptyCols.add(j)
        }
    }

    let result = []

    ii = 0
    for (let i=0; i < lines.h(); i++) {
        if (emptyRows.has(i)) ii += space
        jj = 0
        for (let j=0; j < lines.w(); j++) {
            if (emptyCols.has(j)) jj += space
            if (lines[i][j] == '#') {
                result.push({i: i+ii, j: j+jj, origI: i, origJ: j})
            }
        } 
    }
    return result
}



function partA(lines) {
    pos = findExpandedPos(lines, 1)
    console.log(pos)
 
    let sum = 0
    for (let i=0; i < pos.length; i++) {
        for (let j=i+1; j < pos.length; j++) {
            sum += Math.abs(pos[i].i-pos[j].i) + Math.abs(pos[i].j-pos[j].j)
        }
    }
    return sum
}

function partB(lines) {
    pos = findExpandedPos(lines, 999999)
    console.log(pos)

    let sum = 0
    for (let i=0; i < pos.length; i++) {
        for (let j=i+1; j < pos.length; j++) {
            sum += Math.abs(pos[i].i-pos[j].i) + Math.abs(pos[i].j-pos[j].j)
        }
    }
    return sum
}

console.log(partA(test))
// console.log(partA(input))
// console.log('--')
// console.log(partB(test))
// console.log(partB(input))
